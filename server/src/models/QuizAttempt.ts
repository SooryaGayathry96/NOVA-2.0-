import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    answers: [{ type: Number, required: true }],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
