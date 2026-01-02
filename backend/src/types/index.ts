import { Document, ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document<ObjectId, any, any> {
  _id: ObjectId;
  googleId: string;
  email: string;
  name: string;
  storageLimit: number;
  storageUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermission extends Document<ObjectId, any, any> {
  _id: ObjectId;
  fileId: ObjectId;
  userId: ObjectId;
  level: 'read' | 'write';
  createdAt: Date;
  updatedAt: Date;
}

export interface IStar extends Document<ObjectId, any, any> {
  _id: ObjectId;
  fileId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile extends Document<ObjectId, any, any> {
  _id: ObjectId;
  owner: ObjectId;
  originalName: string;
  storageName: string;
  url: string;
  size: number;
  mimeType: string;
  public: boolean;
  deleted: boolean;
  deletedAt: Date | null;
  starCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser extends Request {
  user?: IUser;
}

