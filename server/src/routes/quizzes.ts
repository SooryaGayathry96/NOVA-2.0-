import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Quiz } from '../models/Quiz';
import { QuizAttempt } from '../models/QuizAttempt';
import { User } from '../models/User';
import { evaluateAndAwardAchievements } from '../utils/xpCalculator';

const router = Router();

// GET /api/quizzes
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [quizzes, attempts] = await Promise.all([
      Quiz.find({}).select('title description passingScore xpReward questions.length'),
      QuizAttempt.find({ userId }),
    ]);

    const bestAttemptsMap = new Map<string, any>();
    attempts.forEach((att) => {
      const qid = att.quizId.toString();
      const existing = bestAttemptsMap.get(qid);
      if (!existing || att.percentage > existing.percentage) {
        bestAttemptsMap.set(qid, att);
      }
    });

    const mappedQuizzes = quizzes.map((q) => {
      const best = bestAttemptsMap.get(q._id.toString());
      return {
        _id: q._id,
        title: q.title,
        description: q.description,
        passingScore: q.passingScore,
        xpReward: q.xpReward,
        questionCount: q.questions.length,
        bestAttempt: best
          ? {
              score: best.score,
              totalQuestions: best.totalQuestions,
              percentage: best.percentage,
              passed: best.passed,
              completedAt: best.completedAt,
            }
          : null,
      };
    });

    res.json({ success: true, quizzes: mappedQuizzes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve quizzes.' });
  }
});

// GET /api/quizzes/:id
// Returns questions WITHOUT correctIndex to prevent cheating
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }

    const sanitizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      factTag: q.factTag,
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        xpReward: quiz.xpReward,
        questions: sanitizedQuestions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving quiz.' });
  }
});

// POST /api/quizzes/:id/submit
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { answers } = req.body; // Array of selected option indices e.g. [2, 1, 0, 3]

    if (!Array.isArray(answers)) {
      res.status(400).json({ success: false, message: 'Answers must be provided as an array.' });
      return;
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found.' });
      return;
    }

    let correctCount = 0;
    const results = quiz.questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        prompt: q.prompt,
        userAnswer,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        factTag: q.factTag,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScore;

    // Check if user has previously passed this quiz
    const previousPassed = await QuizAttempt.findOne({ userId, quizId: quiz._id, passed: true });
    let xpEarned = 0;

    if (passed && !previousPassed) {
      xpEarned = quiz.xpReward;
      const user = await User.findById(userId);
      if (user) {
        user.totalXP += xpEarned;
        await user.save();
      }
    }

    // Record the attempt in database
    const attempt = await QuizAttempt.create({
      userId,
      quizId: quiz._id,
      answers,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      xpEarned,
      completedAt: new Date(),
    });

    // Evaluate achievements
    const newAchievements = await evaluateAndAwardAchievements(userId.toString());

    res.json({
      success: true,
      result: {
        score: correctCount,
        totalQuestions,
        percentage,
        passed,
        passingScore: quiz.passingScore,
        xpEarned,
        alreadyEarnedXP: !!previousPassed,
        results,
        attemptId: attempt._id,
      },
      newAchievements,
    });
  } catch (error: any) {
    console.error('Quiz evaluation error:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate quiz submission.' });
  }
});

export default router;
