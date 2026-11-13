import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';

const router = Router();

// GET /api/leaderboard
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find({})
        .select('name callsign avatar totalXP rank createdAt')
        .sort({ totalXP: -1, createdAt: 1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    // Aggregate completed missions for these users
    const userIds = users.map((u) => u._id);
    const missionStats = await UserProgress.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          type: 'mission',
          status: 'completed',
        },
      },
      {
        $group: {
          _id: '$userId',
          completedCount: { $sum: 1 },
        },
      },
    ]);

    const missionCountMap = new Map<string, number>();
    missionStats.forEach((stat) => {
      missionCountMap.set(stat._id.toString(), stat.completedCount);
    });

    const leaderboard = users.map((u, index) => ({
      position: skip + index + 1,
      id: u._id,
      name: u.name,
      callsign: u.callsign,
      avatar: u.avatar,
      totalXP: u.totalXP,
      rank: u.rank,
      completedMissions: missionCountMap.get(u._id.toString()) || 0,
      joinedAt: u.createdAt,
    }));

    res.json({
      success: true,
      leaderboard,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve astronaut leaderboard.' });
  }
});

export default router;
