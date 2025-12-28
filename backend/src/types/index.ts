import { Document, ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document<ObjectId, any, any> {
  _id: ObjectId;
  googleId: string;
  email: string;
  name: string;
  storageLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermission {
  userId: ObjectId;
  level: 'read' | 'write';
}

export interface IFile extends Document<ObjectId, any, any> {
  _id: ObjectId;
  owner: ObjectId;
  originalName: string;
  storageName: string;
  url: string;
  size: number;
  public: boolean;
  permissions: IPermission[];
  starredBy: ObjectId[];
  deleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser extends Request {
  user?: IUser;
}

