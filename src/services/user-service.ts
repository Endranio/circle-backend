import { CreateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class UserService {
  async getUser() {
    return await prisma.user.findMany();
  }

  async createUser(data: CreateUserDTO) {
    return await prisma.user.create({ data });
  }
}

export default new UserService();
