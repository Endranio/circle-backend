import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullname'];
};

export type CreateUserDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullName'
>;
export type UpdateUserDTO = Pick<UserProfile, 'email' | 'password'>;
