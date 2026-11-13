import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  factTag?: string;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  moduleId?: mongoose.Types.ObjectId;
  missionId?: mongoose.Types.ObjectId;
  passingScore: number;
  xpReward: number;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
    missionId: { type: Schema.Types.ObjectId, ref: 'Mission' },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    xpReward: { type: Number, default: 100 },
    questions: [
      {
        id: { type: String, required: true },
        prompt: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },
        explanation: { type: String, required: true },
        factTag: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
