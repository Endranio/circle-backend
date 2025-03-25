import express, { Request, Response } from 'express';
import prisma from '../libs/prima';
import userController from '../controllers/user-controller';
import { authCheck } from '../middlewares/auth-middleware';
import { upload } from '../middlewares/upload-middleware';
import { initCloudinary } from '../middlewares/cloudinary-middleware';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/search', userController.getUserSearch);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
// router.get('/:username', userController.getUserByUsername);
router.delete('/:id', userController.deleteUserById);
router.patch('/:id', userController.updateUserById);
router.patch(
  '/profile/:userId',
  authCheck,
  initCloudinary,
  upload.fields([{ name: 'avatarUrl' }, { name: 'bannerUrl' }]),
  userController.updateprofileByUserId,
);

export default router;
