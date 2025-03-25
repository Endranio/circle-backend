import prisma from '../libs/prima';

class LikeService {
  async getLikeById(userId: string, threadId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        threadId,
      },
    });
  }

  async createLike(followedId: string, followingId: string) {
    return await prisma.follow.create({
      data: { followedId, followingId },
    });
  }

  async deleteLike(id: string) {
    return await prisma.like.delete({
      where: { id },
    });
  }
}

export default new LikeService();
