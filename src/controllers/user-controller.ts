import { Request, Response, NextFunction } from 'express';
import userService from '../services/user-service';
import {
  createUserSchema,
  updateProfileSchema,
  updateUserSchema,
} from '../utils/schemas/user-schema';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import followService from '../services/follow-service';

class userController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUser();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
  async getUserSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;

      const userId = (req as any).user.id;
      if (!search.trim()) {
        res.json([]);
        return;
      }

      const users = await userService.getUserSearch(search);

      const newUsers = await Promise.all(
        users.map(async (user) => {
          const userfollow = await followService.getFollow(userId, user.id);
          const isFollow = userfollow ? true : false;

          return {
            ...user,
            isFollow,
          };
        }),
      );
      res.send(newUsers);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validated = await createUserSchema.validateAsync(body);
      const user = await userService.createUser(validated);
      res.json(user);
    } catch (error) {
      res.status(400).json((error as any).details);
    }
  }
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      const followersCount = user?.followings.length;
      const followingsCount = user?.followers.length;
      const newUser = {
        ...user,
        followersCount,
        followingsCount,
      };

      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      console.log('Received username:', username);
      const user = await userService.getUserByUsername(username);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async updateUserById(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  }
  async updateprofileByUserId(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
        "multipart/form-data": {
            schema: {
                $ref: "#/components/schemas/UpdateUserProfileDTO"
            }  
        }
    }
} 
*/
    console.log(req.body, 'ini body');
    try {
      const { userId } = req.params;
      let avatarUploadResult: UploadApiResponse = {} as UploadApiResponse;
      let bannerUploadResult: UploadApiResponse = {} as UploadApiResponse;
      const profile = await userService.getProfileByUserId(userId);
      if (!profile) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }
      interface MulterFiles {
        avatarUrl?: Express.Multer.File[];
        bannerUrl?: Express.Multer.File[];
      }

      const files = req.files as MulterFiles;

      if (files.avatarUrl && files.avatarUrl.length > 0) {
        avatarUploadResult = await cloudinary.uploader.upload(
          files.avatarUrl[0].path,
        );
      }

      if (files.bannerUrl && files.bannerUrl.length > 0) {
        bannerUploadResult = await cloudinary.uploader.upload(
          files.bannerUrl[0].path,
        );
      }
      const body = {
        ...req.body,
        avatarUrl:
          avatarUploadResult?.secure_url ?? profile.avatarUrl ?? undefined,
        bannerUrl:
          bannerUploadResult?.secure_url ?? profile.bannerUrl ?? undefined,
      };

      const validatedData = await updateProfileSchema.validateAsync(body);
      const updatedProfile = await userService.updateProfileByUserId(
        profile.id,
        validatedData,
      );
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
