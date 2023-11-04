import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessages } from '../error-msgs';
import { CreateStatusListDto, EditStatusListDto } from './dto';
import { ValidationService } from '../validation.service';

@Injectable()
export class StatusListService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  getStatusListById(userId: number, statusListId: number) {
    return this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
        board: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });
  }

  async getStatusListsOfBoard(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return this.prismaService.statusList.findMany({
      where: {
        boardId: boardId,
      },
    });
  }

  async createStatusList(userId: number, dto: CreateStatusListDto) {
    this.validationService.checkForBoard(userId, dto.boardId);
    return this.prismaService.statusList.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteStatusListById(userId: number, statusListId: number) {
    this.validationService.checkForBoard(userId, statusListId).catch();
    return this.prismaService.statusList.delete({
      where: {
        id: statusListId,
      },
    });
  }

  async editStatusListById(userId: number, statusListId: number, dto: EditStatusListDto) {
    const statusList = await this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
      },
    });
    this.validationService.checkForBoard(userId, statusList.boardId);
    return this.prismaService.statusList.update({
      where: {
        id: statusListId,
      },
      data: {
        ...dto,
      },
    });
  }
}
