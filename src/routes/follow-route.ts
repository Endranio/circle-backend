// import express from 'express';
// import { authCheck } from '../middlewares/auth-middleware';

// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import RedisClient from 'ioredis'
// import followController from '../controllers/follow-controller';

// const router = express.Router();

// const client = new RedisClient()

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//     message:{
//         message:"Try again later"
//     },store: new RedisStore({
// 		// @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
// 		sendCommand: (...args: string[]) => client.call(...args),
// 	}),
// 	// store: ... , // Redis, Memcached, etc. See below.
// })

// router.use(limiter)

// router.post('/', authCheck, followController.createFollow);
// // router.delete('/:threadId', authCheck, followController.deleteFollow);

// export default router;
