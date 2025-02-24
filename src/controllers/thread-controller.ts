import { Request, Response } from 'express';
import threadService from '../services/thread-service';
import { createUserSchema } from '../utils/schemas/user-schema';
import { createThreadSchema } from '../utils/schemas/thread-schema';
import { v2 as cloudinary } from 'cloudinary';

class threadController {
  async getThread(req: Request, res: Response) {
    try {
      const users = await threadService.getThread();
      res.send(users);
    } catch {
      res.json(Error);
    }
  }
  async createThread(req: Request, res: Response) {
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
      const uploadResult = await cloudinary.uploader.upload(
        req.file?.path || '',
      );
      const body = {
        ...req.body,
        images: uploadResult.secure_url,
      };
      const userId = (req as any).user.id;

      const validated = await createThreadSchema.validateAsync(body);

      const thread = await threadService.createThread(userId, validated);
      console.log('thread result', thread);
      res.json(thread);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }
  async getThreadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await threadService.getThreadById(id);
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  }
}

export default new threadController();
