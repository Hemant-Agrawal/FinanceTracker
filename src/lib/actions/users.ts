'use server';

import { auth } from '@/auth';
import { UserColl } from '@/models';
import { revalidatePath } from 'next/cache';

export async function getUser() {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const user = await UserColl.findById(authUser.user.id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export async function updateUser(data: Record<string, unknown>) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const updated = await UserColl.updateById(authUser.user.id, data);
  revalidatePath('/settings');
  return updated;
}

