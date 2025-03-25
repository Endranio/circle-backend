import Joi from 'joi';

import { CreateFollowDTO } from '../../dtos/follow-dtos';

export const createFollowSchema = Joi.object<CreateFollowDTO>({
  followingId: Joi.string().uuid(),
});

// export const deleteLikeSchema = Joi.object<DeleteLikeDTO>({
//   threadId: Joi.string().uuid(),
// });
