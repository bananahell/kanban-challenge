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

  async getStatusListById(userId: number, statusListId: number) {
    await this.validationService.checkForStatusListUser(userId, statusListId);
    return await this.prismaService.statusList.findUnique({
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
    await this.validationService.checkForBoardUser(userId, boardId);
    return await this.prismaService.statusList.findMany({
      where: {
        boardId: boardId,
      },
    });
  }

  async createStatusList(userId: number, dto: CreateStatusListDto) {
    await this.validationService.checkForBoardUser(userId, dto.boardId);
    return await this.prismaService.statusList.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteStatusListById(userId: number, statusListId: number) {
    await this.validationService.checkForBoardUser(userId, statusListId);
    return await this.prismaService.statusList.delete({
      where: {
        id: statusListId,
      },
    });
  }

  async editStatusListById(userId: number, statusListId: number, dto: EditStatusListDto) {
    await this.validationService.checkForStatusListUser(userId, statusListId);
    return await this.prismaService.statusList.update({
      where: {
        id: statusListId,
      },
      data: {
        ...dto,
      },
    });
  }
}
