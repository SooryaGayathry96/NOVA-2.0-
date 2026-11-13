import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  unlockedAt: Date;
}

const UserAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    achievementId: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);
