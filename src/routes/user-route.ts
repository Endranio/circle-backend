import express, { Request, Response } from 'express';
import prisma from '../libs/prima';
import userController from '../controllers/user-controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUserById);
router.patch('/:id', userController.updateUserById);

export default router;
