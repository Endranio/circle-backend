import { Request, Response } from 'express';
import userService from '../services/user-service';

class userController {
  async getUsers(req: Request, res: Response) {
    const users = await userService.getUser();
    res.send(users);
  }
  async createUser(req: Request, res: Response) {
    const { username, password, email } = req.body;
    const user = await userService.createUser({ username, password, email });
    res.send(user);
  }
}

export default new userController();
