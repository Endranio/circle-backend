import express, { Request, Response } from 'express';

import threadController from '../controllers/thread-controller';
import { initCloudinary } from '../middlewares/cloudinary-middleware';
import { upload } from '../middlewares/upload-middleware';
import { authCheck } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/', authCheck, threadController.getThread);
router.get('/user/:id', authCheck, threadController.getThreadByUser);
router.get('/:id', authCheck, threadController.getThreadById);
router.delete('/:id', authCheck, threadController.deleteThreadById);
router.patch(
  '/:id',
  authCheck,
  initCloudinary,
  upload.single('images'),
  threadController.updateThreadById,
);
router.post(
  '/',
  authCheck,
  initCloudinary,
  upload.single('images'),
  threadController.createThread,
);

export default router;
