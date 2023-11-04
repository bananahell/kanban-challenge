import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorMessages } from './error-msgs';

@Injectable()
export class ValidationService {
  constructor(private prismaService: PrismaService) {}

  async checkForBoard(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (board.ownerId != userId) {
      throw new ForbiddenException(ErrorMessages.NotAllowedToEdit);
    }
    return board;
  }
}
