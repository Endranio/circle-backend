import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullname'];
};

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullName'
>;
export type LoginDTO = Pick<User, 'email' | 'password'>;
