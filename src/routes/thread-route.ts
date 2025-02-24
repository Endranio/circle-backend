import express, { Request, Response } from 'express';
import prisma from '../libs/prima';
import threadController from '../controllers/thread-controller';
import { initCloudinary } from '../middlewares/cloudinary-middleware';
import { upload } from '../middlewares/upload-middleware';
import { authCheck } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/', threadController.getThread);
router.get('/:id', threadController.getThreadById);
router.post(
  '/',
  authCheck,
  initCloudinary,
  upload.single('images'),
  threadController.createThread,
);

export default router;
