import joi from 'joi';
import { CreateUserDTO } from '../../dtos/user-dtos';

import { Profile } from '@prisma/client';

const createUserSchema = joi.object<CreateUserDTO>({
  email: joi.string().email().required(),
  username: joi.string().min(2).required(),
  password: joi.string().min(6).required(),

  fullName: joi.string().required(),
});
const updateUserSchema = joi.object<CreateUserDTO>({
  email: joi.string().email(),
  username: joi.string().min(2),
});

export { createUserSchema, updateUserSchema };
