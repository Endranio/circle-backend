import joi from 'joi';
import { RegisterDTO } from '../../dtos/auth-dtos';

const registerSchema = joi.object<RegisterDTO>({
  email: joi.string().email().required(),
  username: joi.string().min(2).required(),
  password: joi.string().min(6).required(),
  fullName: joi.string(),
});
const loginSchema = joi.object<RegisterDTO>({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
export { registerSchema, loginSchema };
