import mongoose, { Schema } from 'mongoose';
import { IPermission } from '../types';

const permissionSchema = new Schema<IPermission>(
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
    level: {
      type: String,
      enum: ['read', 'write'],
      required: true,
    },
  },
  { timestamps: true }
);

permissionSchema.index({ fileId: 1, userId: 1 }, { unique: true });
permissionSchema.index({ userId: 1, fileId: 1 });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);


