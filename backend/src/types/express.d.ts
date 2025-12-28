import { IUser } from './index';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}




