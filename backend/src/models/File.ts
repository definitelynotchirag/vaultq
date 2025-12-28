import mongoose, { Schema } from 'mongoose';
import { IFile, IPermission } from '../types';

const permissionSchema = new Schema<IPermission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    level: {
      type: String,
      enum: ['read', 'write'],
      required: true,
    },
  },
  { _id: false }
);

const fileSchema = new Schema<IFile>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    storageName: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    public: {
      type: Boolean,
      default: false,
      index: true,
    },
    permissions: {
      type: [permissionSchema],
      default: [],
    },
    starredBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      index: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ originalName: 'text' });
fileSchema.index({ 'permissions.userId': 1 });

export const File = mongoose.model<IFile>('File', fileSchema);


