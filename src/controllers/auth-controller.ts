import { Request, Response } from 'express';
import authService from '../services/auth-service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth-schema';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/auth-dtos';
import userService from '../services/user-service';
import jwt from 'jsonwebtoken';
import { transporter } from '../libs/nodemailer';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const body = req.body;
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          mesaage: 'email/password is wrong',
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(404).json({
          message: 'email/password is wrong',
        });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET || '';

      const token = jwt.sign(
        {
          id: user.id,
        },
        jwtSecret,
        {
          expiresIn: '1h',
        },
      );

      res.send({
        message: 'login success',
        token,
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

  async check(req: Request, res: Response) {
    try {
      const payload = (req as any).user;
      const user = await userService.getUserById(payload.id);
      res.send(user);
    } catch (error) {
      res.json(error);
    }
  }
  async forgot(req: Request, res: Response) {
    try {
      const body = req.body;
      const { email } = await forgotPasswordSchema.validateAsync(body);
      const jwtSecret = process.env.JWT_SECRET || '';
      const token = jwt.sign({ email }, jwtSecret, {
        expiresIn: '1 day',
      });

      const frontend = process.env.FRONTEND_BASE_URL || '';
      const resetPasswordLink = `${frontend}/reset-password?token=${token}`;

      const mailOptions = {
        form: 'endranio576@gmail.com',
        to: email,
        subject: 'Circle | Forgot Password',
        // text:"e password email belum ada"
        html: `<h1>this link nya</h1>
      <a href="${resetPasswordLink}">${resetPasswordLink}`,
      };
      await transporter.sendMail(mailOptions);

      const user = await userService.getUserByEmail(email);
      res.json({
        messege: 'forgot password link send',
      });
    } catch (error) {
      res.json(error);
    }
  }
  async reset(req: Request, res: Response) {
    try {
      const payload = (req as any).user;
      const body = req.body;
      const { oldpassword, newpassword } =
        await resetPasswordSchema.validateAsync(body);
      const user = await userService.getUserByEmail(payload.email);

      if (oldpassword === newpassword) {
        res.status(400).json({
          messege: "password can't be same",
        });
        return;
      }

      if (!user) {
        res.status(404).json({
          messege: 'user not found',
        });
        return;
      }

      const isOldPasswordCorect = await bcrypt.compare(
        oldpassword,
        user.password,
      );
      if (!isOldPasswordCorect) {
        res.status(404).json({
          messege: 'user not found',
        });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newpassword, 10);
      const updatedUSerPassword = await authService.resetPassword(
        user.email,
        hashedNewPassword,
      );
      res.send(updatedUSerPassword);
    } catch (error) {
      res.json(error);
    }
  }
}

export default new AuthController();
