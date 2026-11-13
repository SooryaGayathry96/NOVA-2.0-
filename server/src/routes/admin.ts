import { Router, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Mission } from '../models/Mission';
import { Module } from '../models/Module';
import { Quiz } from '../models/Quiz';
import { QuizAttempt } from '../models/QuizAttempt';
import { UserProgress } from '../models/UserProgress';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/analytics
router.get('/analytics', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalMissions, totalModules, totalQuizzes, completedMissions, quizAttempts] =
      await Promise.all([
        User.countDocuments(),
        Mission.countDocuments(),
        Module.countDocuments(),
        Quiz.countDocuments(),
        UserProgress.countDocuments({ type: 'mission', status: 'completed' }),
        QuizAttempt.find({}),
      ]);

    const totalXPResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalXP' } } },
    ]);

    const totalXP = totalXPResult[0]?.total || 0;
    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length)
        : 0;

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalMissions,
        totalModules,
        totalQuizzes,
        completedMissions,
        totalQuizAttempts: quizAttempts.length,
        averageQuizScore: avgQuizScore,
        totalXPDistributed: totalXP,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin analytics.' });
  }
});

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({})
      .select('name email role callsign avatar totalXP rank createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user directory.' });
  }
});

// POST /api/admin/missions
router.post('/missions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.create(req.body);
    res.status(201).json({ success: true, mission, message: 'New mission published to Mission Control!' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating mission.' });
  }
});

// PATCH /api/admin/missions/:id
router.patch('/missions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mission) {
      res.status(404).json({ success: false, message: 'Mission not found.' });
      return;
    }
    res.json({ success: true, mission, message: 'Mission updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/admin/modules
router.post('/modules', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json({ success: true, module, message: 'New learning module published!' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/modules/:id
router.patch('/modules/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found.' });
      return;
    }
    res.json({ success: true, module, message: 'Learning module updated.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
