import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { UserAchievement } from '../models/UserAchievement';
import { QuizAttempt } from '../models/QuizAttempt';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const [completedMissions, completedModules, quizAttempts, achievements] = await Promise.all([
      UserProgress.find({ userId: user._id, type: 'mission', status: 'completed' }).populate('missionId'),
      UserProgress.find({ userId: user._id, type: 'module', status: 'completed' }).populate('moduleId'),
      QuizAttempt.find({ userId: user._id }).populate('quizId').sort({ completedAt: -1 }).limit(10),
      UserAchievement.find({ userId: user._id }).populate('achievementId').sort({ unlockedAt: -1 }),
    ]);

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        callsign: user.callsign,
        avatar: user.avatar,
        totalXP: user.totalXP,
        rank: user.rank,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt,
        stats: {
          missionsCompleted: completedMissions.length,
          modulesCompleted: completedModules.length,
          quizzesPassed: quizAttempts.filter((q) => q.passed).length,
          achievementsUnlocked: achievements.length,
        },
        achievements,
        completedMissions,
        completedModules,
        quizHistory: quizAttempts,
      },
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile data.' });
  }
});

// PATCH /api/users/profile
router.patch('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, callsign, avatar, bio } = req.body;
    const user = await User.findById(req.user!._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name.trim();
    if (callsign) user.callsign = callsign.trim();
    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Astronaut profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        callsign: user.callsign,
        avatar: user.avatar,
        totalXP: user.totalXP,
        rank: user.rank,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update astronaut profile.' });
  }
});

export default router;
