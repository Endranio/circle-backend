import { Follow } from '@prisma/client';

export type CreateFollowDTO = Pick<Follow, 'followingId'>;

// export type DeleteLikeDTO = Pick<Like, 'threadId'>;
