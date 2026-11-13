import { User, IUser } from '../models/User';
import { Achievement, IAchievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';
import { UserProgress } from '../models/UserProgress';
import { QuizAttempt } from '../models/QuizAttempt';

export const getRankForXP = (xp: number): 'Cadet' | 'Junior Astronaut' | 'Space Explorer' | 'Mission Specialist' | 'Commander' => {
  if (xp >= 2000) return 'Commander';
  if (xp >= 1200) return 'Mission Specialist';
  if (xp >= 600) return 'Space Explorer';
  if (xp >= 250) return 'Junior Astronaut';
  return 'Cadet';
};

export const getNextRankThreshold = (xp: number): { nextRank: string; neededXP: number; currentTierBase: number; currentTierMax: number } => {
  if (xp >= 2000) {
    return { nextRank: 'Max Rank: Commander', neededXP: 0, currentTierBase: 2000, currentTierMax: 2000 };
  } else if (xp >= 1200) {
    return { nextRank: 'Commander', neededXP: 2000 - xp, currentTierBase: 1200, currentTierMax: 2000 };
  } else if (xp >= 600) {
    return { nextRank: 'Mission Specialist', neededXP: 1200 - xp, currentTierBase: 600, currentTierMax: 1200 };
  } else if (xp >= 250) {
    return { nextRank: 'Space Explorer', neededXP: 600 - xp, currentTierBase: 250, currentTierMax: 600 };
  } else {
    return { nextRank: 'Junior Astronaut', neededXP: 250 - xp, currentTierBase: 0, currentTierMax: 250 };
  }
};

export const evaluateAndAwardAchievements = async (userId: string): Promise<IAchievement[]> => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Fetch all existing achievements
  const allAchievements = await Achievement.find({});
  const existingUnlocks = await UserAchievement.find({ userId: user._id });
  const unlockedAchievementIds = new Set(existingUnlocks.map((ua) => ua.achievementId.toString()));

  // Fetch user stats
  const completedMissionsCount = await UserProgress.countDocuments({
    userId: user._id,
    type: 'mission',
    status: 'completed',
  });

  const completedModulesCount = await UserProgress.countDocuments({
    userId: user._id,
    type: 'module',
    status: 'completed',
  });

  const bestQuizScore = await QuizAttempt.findOne({ userId: user._id }).sort({ percentage: -1 });

  const newlyUnlocked: IAchievement[] = [];

  for (const achievement of allAchievements) {
    if (unlockedAchievementIds.has(achievement._id.toString())) {
      continue;
    }

    let qualifies = false;

    switch (achievement.conditionType) {
      case 'first_mission':
        qualifies = completedMissionsCount >= 1;
        break;
      case 'missions_count':
        qualifies = completedMissionsCount >= achievement.conditionValue;
        break;
      case 'modules_count':
        qualifies = completedModulesCount >= achievement.conditionValue;
        break;
      case 'quiz_score':
        qualifies = !!bestQuizScore && bestQuizScore.percentage >= achievement.conditionValue;
        break;
      case 'total_xp':
        qualifies = user.totalXP >= achievement.conditionValue;
        break;
    }

    if (qualifies) {
      await UserAchievement.create({
        userId: user._id,
        achievementId: achievement._id,
        unlockedAt: new Date(),
      });
      newlyUnlocked.push(achievement);
    }
  }

  // Update User rank
  const correctRank = getRankForXP(user.totalXP);
  if (user.rank !== correctRank) {
    user.rank = correctRank;
    await user.save();
  }

  return newlyUnlocked;
};
