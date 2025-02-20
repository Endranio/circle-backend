import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
app.delete('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
app.patch('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});
app.post('/', (req: Request, res: Response) => {
  res.send('Welcome to circle API');
});

app.listen(port, () => {
  console.info(`server running at port ${port}`);
});
