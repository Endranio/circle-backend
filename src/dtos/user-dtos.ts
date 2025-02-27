import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullname: Profile['fullname'];
};

export type CreateUserDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullname'
>;
export type UpdateUserDTO = Pick<UserProfile, 'email' | 'password'>;
