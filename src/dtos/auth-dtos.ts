import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullname'];
};

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'password' | 'username' | 'fullName'
>;
export type ForgotPasswordDTO = Pick<User, 'email'>;
export type ResetPasswordDTO = {
  oldpassword: string;
  newpassword: string;
};

export type LoginDTO = Pick<User, 'email' | 'password'>;
