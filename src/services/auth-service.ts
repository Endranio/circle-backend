import { RegisterDTO } from '../dtos/auth-dtos';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user-dtos';
import prisma from '../libs/prima';

class AuthService {
  async register(data: RegisterDTO) {
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
  async resetPassword(email: string, hashedNewPassword: string) {
    return await prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
      },
    });
  }
}

export default new AuthService();
