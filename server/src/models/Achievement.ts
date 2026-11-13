import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestone' | 'Missions' | 'Academics' | 'Special';
  xpRequirement: number;
  conditionType: 'first_mission' | 'missions_count' | 'quiz_score' | 'modules_count' | 'total_xp';
  conditionValue: number;
  badgeColor: string;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'award' },
    category: {
      type: String,
      enum: ['Milestone', 'Missions', 'Academics', 'Special'],
      default: 'Milestone',
    },
    xpRequirement: { type: Number, default: 50 },
    conditionType: {
      type: String,
      enum: ['first_mission', 'missions_count', 'quiz_score', 'modules_count', 'total_xp'],
      required: true,
    },
    conditionValue: { type: Number, default: 1 },
    badgeColor: { type: String, default: 'gold' },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
