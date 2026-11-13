import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Mission } from '../models/Mission';
import { Module } from '../models/Module';
import { UserProgress } from '../models/UserProgress';
import { UserAchievement } from '../models/UserAchievement';
import { getNextRankThreshold } from '../utils/xpCalculator';

const router = Router();

// GET /api/dashboard
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const userId = user._id;

    // Fetch user progress for both missions and modules
    const [progressList, allMissions, allModules, userAchievements] = await Promise.all([
      UserProgress.find({ userId }),
      Mission.find({ isPublished: true }),
      Module.find({ isPublished: true }).sort({ order: 1 }),
      UserAchievement.find({ userId }).populate('achievementId').sort({ unlockedAt: -1 }).limit(5),
    ]);

    const completedMissionIds = new Set(
      progressList.filter((p) => p.type === 'mission' && p.status === 'completed').map((p) => p.missionId?.toString())
    );

    const completedModuleIds = new Set(
      progressList.filter((p) => p.type === 'module' && p.status === 'completed').map((p) => p.moduleId?.toString())
    );

    const completedMissionsCount = completedMissionIds.size;
    const completedModulesCount = completedModuleIds.size;

    // Calculate overall training completion %
    const totalItems = allMissions.length + allModules.length;
    const completedItems = completedMissionsCount + completedModulesCount;
    const overallProgressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Rank & XP calculation
    const rankInfo = getNextRankThreshold(user.totalXP);

    // Identify next recommended activity
    const nextUncompletedMission = allMissions.find((m) => !completedMissionIds.has(m._id.toString()));
    const nextUncompletedModule = allModules.find((m) => !completedModuleIds.has(m._id.toString()));

    const availableMissions = allMissions.map((m) => ({
      _id: m._id,
      missionCode: m.missionCode,
      title: m.title,
      description: m.description,
      category: m.category,
      difficulty: m.difficulty,
      xpReward: m.xpReward,
      isCompleted: completedMissionIds.has(m._id.toString()),
    }));

    res.json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          callsign: user.callsign,
          avatar: user.avatar,
          totalXP: user.totalXP,
          rank: user.rank,
          role: user.role,
        },
        stats: {
          totalXP: user.totalXP,
          rank: user.rank,
          missionsCompleted: completedMissionsCount,
          totalMissions: allMissions.length,
          modulesCompleted: completedModulesCount,
          totalModules: allModules.length,
          overallProgressPercent,
          achievementsCount: userAchievements.length,
        },
        rankProgress: rankInfo,
        nextRecommendation: nextUncompletedMission
          ? {
              type: 'mission',
              id: nextUncompletedMission._id,
              title: nextUncompletedMission.title,
              category: nextUncompletedMission.category,
              xpReward: nextUncompletedMission.xpReward,
            }
          : nextUncompletedModule
          ? {
              type: 'module',
              id: nextUncompletedModule._id,
              title: nextUncompletedModule.title,
              category: nextUncompletedModule.category,
              xpReward: nextUncompletedModule.xpReward,
            }
          : null,
        availableMissions,
        recentAchievements: userAchievements,
      },
    });
  } catch (error: any) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard data.' });
  }
});

export default router;
