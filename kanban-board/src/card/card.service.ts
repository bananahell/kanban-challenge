import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateCardDto } from './dto';
import { ErrorMessages } from '../error-msgs';

@Injectable()
export class CardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  getCardsByUser(userId: number) {
    return this.prismaService.card.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async getCardsOfStatusList(userId: number, statusListId: number) {
    const statusList = await this.prismaService.statusList.findUnique({
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
    if (!statusList) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return this.prismaService.card.findMany({
      where: {
        statusListId: statusListId,
      },
    });
  }

  async getCardsOfBoard(userId: number, boardId: number) {
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
    return this.prismaService.card.findMany({
      where: {
        statusList: {
          boardId: boardId,
        },
      },
    });
  }

  getCardById(userId: number, cardId: number) {
    this.prismaService.card.findUnique({
      where: {
        id: cardId,
        statusList: {
          board: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  async createCard(userId: number, dto: CreateCardDto) {
    const statusList = await this.prismaService.statusList.findUnique({
      where: {
        id: dto.statusListId,
      },
    });
    this.validationService.checkForBoardUser(userId, statusList.boardId).catch();
    return this.prismaService.card.create({
      data: {
        ...dto,
      },
    });
  }
}
