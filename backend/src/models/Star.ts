import mongoose, { Schema } from 'mongoose';
import { IStar } from '../types';

const starSchema = new Schema<IStar>(
  {
    fileId: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

starSchema.index({ fileId: 1, userId: 1 }, { unique: true });
starSchema.index({ userId: 1 });

export const Star = mongoose.model<IStar>('Star', starSchema);


