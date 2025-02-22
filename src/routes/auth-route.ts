import express, { Request, Response } from 'express';
import prisma from '../libs/prima';
import userController from '../controllers/auth-controller';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
// router.post('/check', userController.getUserById);

export default router;
