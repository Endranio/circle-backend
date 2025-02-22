import { Request, Response } from 'express';
import authService from '../services/auth-service';
import { loginSchema, registerSchema } from '../utils/schemas/auth-schema';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/auth-dtos';
import userService from '../services/user-service';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const body = req.body;
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          massage: 'email/password is wrong',
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(404).json({
          massage: 'email/password is wrong',
        });
        return;
      }

      res.send({
        massage: 'login success',
      });
    } catch (error) {
      res.json(error);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const body = req.body;
      const validated = await registerSchema.validateAsync(body);
      const hashedpassword = await bcrypt.hash(validated.password, 10);
      const registerBody: RegisterDTO = {
        ...validated,
        password: hashedpassword,
      };

      const user = await authService.register(registerBody);
      res.json(user);
    } catch (error) {
      res.status(400).json((error as any).details);
    }
  }
}

export default new AuthController();
