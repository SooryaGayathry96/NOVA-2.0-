export type UserRole = 'cadet' | 'admin';

export type AstronautRank =
  | 'Cadet'
  | 'Junior Astronaut'
  | 'Space Explorer'
  | 'Mission Specialist'
  | 'Commander';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  callsign: string;
  avatar: string;
  totalXP: number;
  rank: AstronautRank;
  bio?: string;
  createdAt?: string;
}

export interface Achievement {
  _id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestone' | 'Missions' | 'Academics' | 'Special';
  xpRequirement: number;
  badgeColor: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
}

export interface ModuleSection {
  heading: string;
  body: string;
  facts?: string[];
  illustrationKey?: string;
}

export interface LearningModule {
  _id: string;
  title: string;
  description: string;
  category: 'Space Science' | 'Solar System' | 'Astronomy' | 'Spacecraft & Tech' | 'Astronautics';
  order: number;
  readTimeMinutes: number;
  xpReward: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
  completedAt?: string;
  content?: ModuleSection[];
}

export interface Mission {
  _id: string;
  missionCode: string;
  title: string;
  description: string;
  category: 'Space Orientation' | 'Zero Gravity Training' | 'Space Navigation' | 'Emergency Response' | 'Space Exploration';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  instructions: string[];
  activityType: 'planet_id' | 'zero_gravity' | 'navigation' | 'emergency_response' | 'space_exploration';
  activityData?: any;
  xpReward: number;
  badgeCode: string;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  factTag?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  passingScore: number;
  xpReward: number;
  questionCount: number;
  questions?: QuizQuestion[];
  bestAttempt?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    completedAt: string;
  } | null;
}

export interface LeaderboardEntry {
  position: number;
  id: string;
  name: string;
  callsign: string;
  avatar: string;
  totalXP: number;
  rank: AstronautRank;
  completedMissions: number;
  joinedAt: string;
}

export interface DashboardData {
  user: User;
  stats: {
    totalXP: number;
    rank: AstronautRank;
    missionsCompleted: number;
    totalMissions: number;
    modulesCompleted: number;
    totalModules: number;
    overallProgressPercent: number;
    achievementsCount: number;
  };
  rankProgress: {
    nextRank: string;
    neededXP: number;
    currentTierBase: number;
    currentTierMax: number;
  };
  nextRecommendation: {
    type: 'mission' | 'module';
    id: string;
    title: string;
    category: string;
    xpReward: number;
  } | null;
  availableMissions: Mission[];
  recentAchievements: any[];
}
