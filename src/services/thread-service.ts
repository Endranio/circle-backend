import { CreateThreadDTO } from '../dtos/thread-dtos';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class ThreadService {
  async getThread() {
    return await prisma.thread.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createThread(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;

    return await prisma.thread.create({
      data: {
        images,
        content,
        userId,
      },
    });
  }

  async getThreadById(id: string) {
    return await prisma.thread.findFirst({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        replies: true,
      },
    });
  }
}

export default new ThreadService();
