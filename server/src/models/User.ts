import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'cadet' | 'admin';
  callsign: string;
  avatar: string;
  totalXP: number;
  rank: 'Cadet' | 'Junior Astronaut' | 'Space Explorer' | 'Mission Specialist' | 'Commander';
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['cadet', 'admin'], default: 'cadet' },
    callsign: { type: String, default: 'Astronaut Trainee', trim: true },
    avatar: { type: String, default: 'helmet-blue' },
    totalXP: { type: Number, default: 0, min: 0 },
    rank: {
      type: String,
      enum: ['Cadet', 'Junior Astronaut', 'Space Explorer', 'Mission Specialist', 'Commander'],
      default: 'Cadet',
    },
    bio: { type: String, default: 'Ready for space training and exploration!' },
  },
  { timestamps: true }
);

// Calculate Rank based on totalXP
UserSchema.methods.calculateRank = function (): string {
  const xp = this.totalXP || 0;
  if (xp >= 2000) return 'Commander';
  if (xp >= 1200) return 'Mission Specialist';
  if (xp >= 600) return 'Space Explorer';
  if (xp >= 250) return 'Junior Astronaut';
  return 'Cadet';
};

export const User = mongoose.model<IUser>('User', UserSchema);
