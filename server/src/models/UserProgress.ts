import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  missionId?: mongoose.Types.ObjectId;
  type: 'module' | 'mission';
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
  xpEarned: number;
  completedAt?: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
    missionId: { type: Schema.Types.ObjectId, ref: 'Mission' },
    type: { type: String, enum: ['module', 'mission'], required: true },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Partial filter unique indexes so null missionId or moduleId does not clash
UserProgressSchema.index(
  { userId: 1, moduleId: 1 },
  {
    unique: true,
    partialFilterExpression: { moduleId: { $exists: true, $type: 'objectId' } },
  }
);

UserProgressSchema.index(
  { userId: 1, missionId: 1 },
  {
    unique: true,
    partialFilterExpression: { missionId: { $exists: true, $type: 'objectId' } },
  }
);

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
