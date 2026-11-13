import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { UserProgress } from '../models/UserProgress';
import { Achievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';
import { QuizAttempt } from '../models/QuizAttempt';
import { Module } from '../models/Module';
import { Mission } from '../models/Mission';
import { getNextRankThreshold } from '../utils/xpCalculator';

const router = Router();

// GET /api/progress
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const userId = user._id;

    const [allModules, allMissions, progressRecords, quizAttempts, userAchievements] = await Promise.all([
      Module.find({ isPublished: true }).sort({ order: 1 }),
      Mission.find({ isPublished: true }),
      UserProgress.find({ userId }),
      QuizAttempt.find({ userId }).populate('quizId', 'title passingScore').sort({ completedAt: -1 }),
      UserAchievement.find({ userId }).populate('achievementId').sort({ unlockedAt: -1 }),
    ]);

    const completedModuleIds = new Set(
      progressRecords.filter((p) => p.type === 'module' && p.status === 'completed').map((p) => p.moduleId?.toString())
    );

    const completedMissionIds = new Set(
      progressRecords.filter((p) => p.type === 'mission' && p.status === 'completed').map((p) => p.missionId?.toString())
    );

    const totalModules = allModules.length;
    const completedModules = completedModuleIds.size;
    const totalMissions = allMissions.length;
    const completedMissions = completedMissionIds.size;

    const modulesProgressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    const missionsProgressPercent = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    const totalItems = totalModules + totalMissions;
    const totalCompleted = completedModules + completedMissions;
    const overallProgressPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    const rankInfo = getNextRankThreshold(user.totalXP);

    res.json({
      success: true,
      progress: {
        totalXP: user.totalXP,
        rank: user.rank,
        rankInfo,
        overallProgressPercent,
        modules: {
          total: totalModules,
          completed: completedModules,
          percent: modulesProgressPercent,
          list: allModules.map((m) => ({
            id: m._id,
            title: m.title,
            category: m.category,
            order: m.order,
            isCompleted: completedModuleIds.has(m._id.toString()),
          })),
        },
        missions: {
          total: totalMissions,
          completed: completedMissions,
          percent: missionsProgressPercent,
          list: allMissions.map((m) => ({
            id: m._id,
            missionCode: m.missionCode,
            title: m.title,
            category: m.category,
            difficulty: m.difficulty,
            isCompleted: completedMissionIds.has(m._id.toString()),
          })),
        },
        quizHistory: quizAttempts,
        achievements: userAchievements,
      },
    });
  } catch (error: any) {
    console.error('Progress tracker error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve progress data.' });
  }
});

// GET /api/achievements
router.get('/achievements', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [allAchievements, userAchievements] = await Promise.all([
      Achievement.find({}),
      UserAchievement.find({ userId }),
    ]);

    const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId.toString(), ua.unlockedAt]));

    const mapped = allAchievements.map((a) => {
      const unlockedAt = unlockedMap.get(a._id.toString());
      return {
        _id: a._id,
        code: a.code,
        title: a.title,
        description: a.description,
        icon: a.icon,
        category: a.category,
        xpRequirement: a.xpRequirement,
        badgeColor: a.badgeColor,
        isUnlocked: !!unlockedAt,
        unlockedAt: unlockedAt || null,
      };
    });

    res.json({ success: true, achievements: mapped });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve achievements.' });
  }
});

export default router;
