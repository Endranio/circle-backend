import { CreateUserDTO, UpdateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class UserService {
  async getUser() {
    return await prisma.user.findMany();
  }

  async createUser(data: CreateUserDTO) {
    const { fullName, ...userData } = data;
    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullname: data.fullName,
          },
        },
      },
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      include: {
        profile: true,
      },
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
  async deleteUserById(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
  async updateUserById(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
}

export default new UserService();
