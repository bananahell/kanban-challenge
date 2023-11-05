import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Edits a user by its id.
   * @param userId User's id.
   * @param dto Data from controller.
   * @returns The just edited user without their password hash.
   */
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.passHash;
    return user;
  }
}
