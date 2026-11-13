import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Module } from '../models/Module';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { Quiz } from '../models/Quiz';
import { evaluateAndAwardAchievements } from '../utils/xpCalculator';

const router = Router();

// GET /api/modules
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [modules, userProgress] = await Promise.all([
      Module.find({ isPublished: true }).sort({ order: 1 }),
      UserProgress.find({ userId, type: 'module' }),
    ]);

    const progressMap = new Map(userProgress.map((p) => [p.moduleId?.toString(), p]));

    const mappedModules = modules.map((m) => {
      const prog = progressMap.get(m._id.toString());
      return {
        _id: m._id,
        title: m.title,
        description: m.description,
        category: m.category,
        order: m.order,
        readTimeMinutes: m.readTimeMinutes,
        xpReward: m.xpReward,
        status: prog?.status || 'not-started',
        progressPercent: prog?.progressPercent || 0,
        completedAt: prog?.completedAt,
      };
    });

    res.json({ success: true, modules: mappedModules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve learning modules.' });
  }
});

// GET /api/modules/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const module = await Module.findById(req.params.id);

    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found.' });
      return;
    }

    const [userProgress, linkedQuiz] = await Promise.all([
      UserProgress.findOne({ userId, moduleId: module._id }),
      Quiz.findOne({ moduleId: module._id }).select('title description passingScore xpReward'),
    ]);

    res.json({
      success: true,
      module,
      status: userProgress?.status || 'not-started',
      progressPercent: userProgress?.progressPercent || 0,
      completedAt: userProgress?.completedAt,
      linkedQuiz: linkedQuiz || null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error loading module.' });
  }
});

// POST /api/modules/:id/complete
router.post('/:id/complete', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const module = await Module.findById(req.params.id);

    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found.' });
      return;
    }

    let progress = await UserProgress.findOne({ userId, moduleId: module._id });
    let xpAwarded = 0;

    if (progress && progress.status === 'completed') {
      // Already completed; prevent duplicate XP farming
      res.json({
        success: true,
        message: 'Module was already marked as completed.',
        xpAwarded: 0,
        newAchievements: [],
      });
      return;
    }

    xpAwarded = module.xpReward;

    if (!progress) {
      progress = new UserProgress({
        userId,
        moduleId: module._id,
        type: 'module',
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

    // Award XP to user
    const user = await User.findById(userId);
    if (user) {
      user.totalXP += xpAwarded;
      await user.save();
    }

    // Evaluate achievements
    const newAchievements = await evaluateAndAwardAchievements(userId.toString());

    res.json({
      success: true,
      message: `Module completed! +${xpAwarded} XP awarded.`,
      xpAwarded,
      newAchievements,
    });
  } catch (error: any) {
    console.error('Module completion error:', error);
    res.status(500).json({ success: false, message: 'Failed to record module completion.' });
  }
});

export default router;
