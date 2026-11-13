import mongoose, { Document, Schema } from 'mongoose';

export interface IModuleSection {
  heading: string;
  body: string;
  facts?: string[];
  illustrationKey?: string;
}

export interface IModule extends Document {
  title: string;
  description: string;
  category: 'Space Science' | 'Solar System' | 'Astronomy' | 'Spacecraft & Tech' | 'Astronautics';
  order: number;
  readTimeMinutes: number;
  content: IModuleSection[];
  xpReward: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Space Science', 'Solar System', 'Astronomy', 'Spacecraft & Tech', 'Astronautics'],
      default: 'Space Science',
    },
    order: { type: Number, required: true, default: 1 },
    readTimeMinutes: { type: Number, default: 5 },
    content: [
      {
        heading: { type: String, required: true },
        body: { type: String, required: true },
        facts: [{ type: String }],
        illustrationKey: { type: String },
      },
    ],
    xpReward: { type: Number, default: 50 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Module = mongoose.model<IModule>('Module', ModuleSchema);
