import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Mission } from '../models/Mission';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { evaluateAndAwardAchievements } from '../utils/xpCalculator';

const router = Router();

// GET /api/missions
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [missions, userProgress] = await Promise.all([
      Mission.find({ isPublished: true }),
      UserProgress.find({ userId, type: 'mission' }),
    ]);

    const progressMap = new Map(userProgress.map((p) => [p.missionId?.toString(), p]));

    const mappedMissions = missions.map((m) => {
      const prog = progressMap.get(m._id.toString());
      return {
        _id: m._id,
        missionCode: m.missionCode,
        title: m.title,
        description: m.description,
        category: m.category,
        difficulty: m.difficulty,
        objectives: m.objectives,
        instructions: m.instructions,
        activityType: m.activityType,
        xpReward: m.xpReward,
        badgeCode: m.badgeCode,
        isCompleted: prog?.status === 'completed',
        completedAt: prog?.completedAt,
      };
    });

    res.json({ success: true, missions: mappedMissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve mission control data.' });
  }
});

// GET /api/missions/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      res.status(404).json({ success: false, message: 'Mission not found.' });
      return;
    }

    const userProgress = await UserProgress.findOne({ userId, missionId: mission._id });

    res.json({
      success: true,
      mission,
      isCompleted: userProgress?.status === 'completed',
      completedAt: userProgress?.completedAt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving mission details.' });
  }
});

// POST /api/missions/:id/complete
// Backend validates the interactive challenge inputs
router.post('/:id/complete', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      res.status(404).json({ success: false, message: 'Mission not found.' });
      return;
    }

    const { submission } = req.body; // Map or array of user answers/decisions
    if (!submission) {
      res.status(400).json({ success: false, message: 'No mission telemetry submitted.' });
      return;
    }

    let correctCount = 0;
    let totalQuestions = 0;
    let feedback: any[] = [];

    // Backend validation logic per activityType
    if (mission.activityType === 'planet_id') {
      const targets = mission.activityData?.targets || [];
      totalQuestions = targets.length;
      targets.forEach((target: any, idx: number) => {
        const userAnswer = submission[target.id] || submission[idx];
        const isCorrect = typeof userAnswer === 'string' && userAnswer.toLowerCase() === target.correctAnswer.toLowerCase();
        if (isCorrect) correctCount++;
        feedback.push({
          targetId: target.id,
          userAnswer,
          correctAnswer: target.correctAnswer,
          isCorrect,
          explanation: target.explanation,
        });
      });
    } else if (mission.activityType === 'zero_gravity') {
      const challenges = mission.activityData?.challenges || [];
      totalQuestions = challenges.length;
      challenges.forEach((challenge: any, idx: number) => {
        const userAnswer = submission[challenge.id] !== undefined ? submission[challenge.id] : submission[idx];
        const isCorrect = Number(userAnswer) === challenge.correctAnswer;
        if (isCorrect) correctCount++;
        feedback.push({
          challengeId: challenge.id,
          userAnswer,
          correctAnswer: challenge.correctAnswer,
          isCorrect,
          explanation: challenge.explanation,
        });
      });
    } else if (mission.activityType === 'navigation') {
      const steps = mission.activityData?.steps || [];
      totalQuestions = steps.length;
      steps.forEach((step: any, idx: number) => {
        const userAnswer = submission[step.id] !== undefined ? submission[step.id] : submission[idx];
        const isCorrect = Number(userAnswer) === step.correctAnswer;
        if (isCorrect) correctCount++;
        feedback.push({
          stepId: step.id,
          userAnswer,
          correctAnswer: step.correctAnswer,
          isCorrect,
          explanation: step.explanation,
        });
      });
    } else if (mission.activityType === 'emergency_response') {
      const scenarios = mission.activityData?.scenarios || [];
      totalQuestions = scenarios.length;
      scenarios.forEach((scenario: any, idx: number) => {
        const userAnswer = submission[scenario.id] !== undefined ? submission[scenario.id] : submission[idx];
        const isCorrect = Number(userAnswer) === scenario.correctAnswer;
        if (isCorrect) correctCount++;
        feedback.push({
          scenarioId: scenario.id,
          userAnswer,
          correctAnswer: scenario.correctAnswer,
          isCorrect,
          explanation: scenario.explanation,
        });
      });
    } else if (mission.activityType === 'space_exploration') {
      const steps = mission.activityData?.steps || [];
      totalQuestions = steps.length;
      steps.forEach((step: any, idx: number) => {
        const userAnswer = submission[step.id] !== undefined ? submission[step.id] : submission[idx];
        const isCorrect = Number(userAnswer) === step.correctAnswer;
        if (isCorrect) correctCount++;
        feedback.push({
          stepId: step.id,
          userAnswer,
          correctAnswer: step.correctAnswer,
          isCorrect,
          explanation: step.explanation,
        });
      });
    } else {
      // General pass fallback
      totalQuestions = 1;
      correctCount = 1;
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
    const passed = scorePercentage >= 65;

    if (!passed) {
      res.json({
        success: false,
        passed: false,
        scorePercentage,
        correctCount,
        totalQuestions,
        message: `Mission telemetry criteria not met (${scorePercentage}%). Review scientific data and re-attempt.`,
        feedback,
      });
      return;
    }

    // Check if already completed
    let progress = await UserProgress.findOne({ userId, missionId: mission._id });
    let xpAwarded = 0;

    if (progress && progress.status === 'completed') {
      res.json({
        success: true,
        passed: true,
        scorePercentage,
        correctCount,
        totalQuestions,
        message: 'Mission verified! You have already earned the commendation XP for this mission.',
        xpAwarded: 0,
        feedback,
        newAchievements: [],
      });
      return;
    }

    xpAwarded = mission.xpReward;

    if (!progress) {
      progress = new UserProgress({
        userId,
        missionId: mission._id,
        type: 'mission',
        status: 'completed',
        progressPercent: 100,
        xpEarned: xpAwarded,
        completedAt: new Date(),
      });
    } else {
      progress.status = 'completed';
      progress.progressPercent = 100;
      progress.xpEarned = xpAwarded;
      progress.completedAt = new Date();
    }
    await progress.save();

    // Award XP
    const user = await User.findById(userId);
    if (user) {
      user.totalXP += xpAwarded;
      await user.save();
    }

    // Evaluate newly unlocked achievements
    const newAchievements = await evaluateAndAwardAchievements(userId.toString());

    res.json({
      success: true,
      passed: true,
      scorePercentage,
      correctCount,
      totalQuestions,
      message: `Mission Accomplished! You scored ${scorePercentage}% and earned +${xpAwarded} XP!`,
      xpAwarded,
      feedback,
      newAchievements,
    });
  } catch (error: any) {
    console.error('Mission completion error:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate mission.' });
  }
});

export default router;
