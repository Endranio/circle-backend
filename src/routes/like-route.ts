import express from 'express';
import { authCheck } from '../middlewares/auth-middleware';
import likeController from '../controllers/like-controller';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import RedisClient from 'ioredis';

const router = express.Router();

const client = new RedisClient();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    message: 'Try again later',
  },
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => client.call(...args),
  }),
  // store: ... , // Redis, Memcached, etc. See below.
});

router.use(limiter);

router.post('/thread', authCheck, likeController.createLikeThread);
router.delete('/thread/:threadId', authCheck, likeController.deleteLikeThread);
router.post('/reply', authCheck, likeController.createLikeReply);
router.delete('/reply/:replyId', authCheck, likeController.deleteLikeReply);

export default router;
