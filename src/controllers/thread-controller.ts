import { Request, Response, NextFunction } from 'express';
import threadService from '../services/thread-service';
import { createUserSchema } from '../utils/schemas/user-schema';
import {
  createThreadSchema,
  updateThreadSchema,
} from '../utils/schemas/thread-schema';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import likeService from '../services/like-service';
class threadController {
  async getThread(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.body.page as string) || 1;
      const limit = parseInt(req.body.limit as string) || 5;
      const startIndex = (page - 1) * limit;
      const pagination = { limit, startIndex };

      const userId = (req as any).user.id;
      const threads = await threadService.getThread(pagination);
      const newThread = await Promise.all(
        threads.map(async (thread) => {
          const like = await likeService.getLikeBythreadId(userId, thread.id);
          const isLike = like ? true : false;
          const likesCount = thread.likes.length;
          const repliesCount = thread.replies.length;
          return {
            ...thread,
            likesCount,
            repliesCount,
            isLike,
          };
        }),
      );

      res.json(newThread);
    } catch (error) {
      next(error);
    }
  }
  async getThreadByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.body.page as string) || 1;
      const limit = parseInt(req.body.limit as string) || 5;
      const startIndex = (page - 1) * limit;
      const pagination = { limit, startIndex };

      const { id } = req.params;
      const userId = id;
      const userIdLike = (req as any).user.id;

      const threads = await threadService.getThreadByUser(userId);
      const newThread = await Promise.all(
        threads.map(async (thread) => {
          const like = await likeService.getLikeBythreadId(
            userIdLike,
            thread.id,
          );
          const isLike = like ? true : false;
          const likesCount = thread.likes.length;
          const repliesCount = thread.replies.length;
          return {
            ...thread,
            likesCount,
            repliesCount,
            isLike,
          };
        }),
      );

      res.json(newThread);
    } catch (error) {
      next(error);
    }
  }
  async createThread(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
        "multipart/form-data": {
            schema: {
                $ref: "#/components/schemas/CreateThreadDTO"
            }  
        }
    }
} 
*/
    try {
      let uploadResult: UploadApiResponse = {} as UploadApiResponse;
      if (req.file) {
        uploadResult = await cloudinary.uploader.upload(req.file?.path || '');

        // fs.unlinkSync(`./tmp/my-uploads/${req.file.path}`);
      }

      const body = {
        ...req.body,
        images: uploadResult?.secure_url ?? undefined,
      };
      const userId = (req as any).user.id;

      const validated = await createThreadSchema.validateAsync(body);

      const thread = await threadService.createThread(userId, validated);

      res.json({
        message: 'Thread created',
        data: { ...thread },
      });
    } catch (error) {
      next(error);
    }
  }
  async getThreadById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const thread = await threadService.getThreadById(id);

      if (!thread) {
        res.status(404).json({
          message: 'Thread is not found!',
        });
        return;
      }
      const like = await likeService.getLikeBythreadId(userId, thread.id);

      const isLike = like ? true : false;
      const likesCount = thread?.likes.length;
      const repliesCount = thread?.replies.length;
      res.json({ ...thread, likesCount, repliesCount, isLike });
    } catch (error) {
      next(error);
    }
  }
  async deleteThreadById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await threadService.deleteThreadById(id);
      res.json('Delete success');
    } catch (error) {
      next(error);
    }
  }
  async updateThreadById(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
       "multipart/form-data": {
            schema: {
                $ref: "#/components/schemas/UpdateThreadDTO"
            }  
        }
    }
} 
*/

    try {
      const { id } = req.params;
      const body = req.body;

      const thread = await threadService.getThreadById(id);
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' });
        return;
      }

      let uploadResult: UploadApiResponse = {} as UploadApiResponse;
      if (req.file) {
        uploadResult = await cloudinary.uploader.upload(req.file.path || '');
      }

      const validatedData = await updateThreadSchema.validateAsync(body);

      if (validatedData.content) {
        thread.content = validatedData.content;
      }
      if (uploadResult?.secure_url) {
        thread.images = uploadResult.secure_url;
      }

      const updatedThread = await threadService.updateThreadById(id, {
        content: thread.content,
        images: thread.images,
      });

      res.json({ data: { ...updatedThread }, message: 'update success' });
    } catch (error) {
      next(error);
    }
  }
}

export default new threadController();
