import { Request, Response, NextFunction } from 'express';
import threadService from '../services/thread-service';
import { createUserSchema } from '../utils/schemas/user-schema';
import { createThreadSchema } from '../utils/schemas/thread-schema';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
class threadController {
  async getThread(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await threadService.getThread();
      res.send(users);
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

        fs.unlinkSync(`./tmp/my-uploads/${req.file.path}`);
      }

      const body = {
        ...req.body,
        images: uploadResult?.secure_url ?? undefined,
      };
      const userId = (req as any).user.id;

      const validated = await createThreadSchema.validateAsync(body);

      const thread = await threadService.createThread(userId, validated);
      console.log('thread result', thread);
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
      const user = await threadService.getThreadById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new threadController();
