import { Request, Response } from 'express';
import userService from '../services/user-service';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user-schema';

class userController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUser();
      res.send(users);
    } catch {
      res.json(Error);
    }
  }
  async createUser(req: Request, res: Response) {
    try {
      const body = req.body;
      const validated = await createUserSchema.validateAsync(body);
      const user = await userService.createUser(validated);
      res.json(user);
    } catch (error) {
      res.status(400).json((error as any).details);
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  }
  async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUserById(id);
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  }
  async updateUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;

      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }

      const { username, email } = await updateUserSchema.validateAsync(body);

      if (email != '') {
        user.email = email;
      }
      if (username != '') {
        user.username = username;
      }
      const updatedUser = await userService.updateUserById(id, user);
      res.json(updatedUser);
    } catch (error) {
      res.json(error);
    }
  }
}

export default new userController();
