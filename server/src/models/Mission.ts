import mongoose, { Document, Schema } from 'mongoose';

export interface IMission extends Document {
  missionCode: string;
  title: string;
  description: string;
  category: 'Space Orientation' | 'Zero Gravity Training' | 'Space Navigation' | 'Emergency Response' | 'Space Exploration';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  instructions: string[];
  activityType: 'planet_id' | 'zero_gravity' | 'navigation' | 'emergency_response' | 'space_exploration';
  activityData: any;
  xpReward: number;
  badgeCode: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema<IMission>(
  {
    missionCode: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Space Orientation', 'Zero Gravity Training', 'Space Navigation', 'Emergency Response', 'Space Exploration'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    objectives: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    activityType: {
      type: String,
      enum: ['planet_id', 'zero_gravity', 'navigation', 'emergency_response', 'space_exploration'],
      required: true,
    },
    activityData: { type: Schema.Types.Mixed, default: {} },
    xpReward: { type: Number, default: 150 },
    badgeCode: { type: String, default: 'FIRST_MISSION' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
