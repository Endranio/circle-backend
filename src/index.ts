import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/root-route';
import authRouter from './routes/auth-route';
import userRouter from './routes/user-route';
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use(rootRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.info(`server running at port ${port}`);
});
