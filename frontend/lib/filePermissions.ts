import { File } from '@/types';
import { User } from '@/types';

export function hasWriteAccess(file: File, user: User | null): boolean {
  if (!user) return false;

  const userId = user._id;
  const ownerId = typeof file.owner === 'object' && file.owner !== null 
    ? (file.owner as any)._id 
    : file.owner;

  if (ownerId === userId || ownerId === (userId as any)) {
    return true;
  }

  const userPermission = file.permissions?.find((perm) => {
    const permUserId = typeof perm.userId === 'object' && perm.userId !== null
      ? (perm.userId as any)._id 
      : perm.userId;
    return permUserId === userId || permUserId === (userId as any);
  });

  return userPermission?.level === 'write';
}

