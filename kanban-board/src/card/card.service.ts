import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateCardDto, EditCardDto, ManageCardUserDto } from './dto';

@Injectable()
export class CardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getCardsByUser(userId: number) {
    return await this.prismaService.card.findMany({
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
    await this.validationService.checkForStatusListUser(userId, statusListId);
    return await this.prismaService.card.findMany({
      where: {
        statusListId: statusListId,
      },
    });
  }

  async getCardsOfBoard(userId: number, boardId: number) {
    await this.validationService.checkForBoardUser(userId, boardId);
    return await this.prismaService.card.findMany({
      where: {
        statusList: {
          boardId: boardId,
        },
      },
    });
  }

  async getCardById(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
    });
  }

  async createCard(userId: number, dto: CreateCardDto) {
    await this.validationService.checkForStatusListUser(userId, dto.statusListId);
    return await this.prismaService.card.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteCardById(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.card.delete({
      where: {
        id: cardId,
      },
    });
  }

  async addCardUser(userId: number, dto: ManageCardUserDto) {
    await this.validationService.checkForCardUser(userId, dto.cardId);
    return await this.prismaService.card.update({
      where: {
        id: dto.cardId,
      },
      data: {
        users: {
          connect: {
            id: dto.userId,
          },
        },
      },
    });
  }

  async removeCardUser(userId: number, dto: ManageCardUserDto) {
    await this.validationService.checkForCardUser(userId, dto.cardId);
    const cardUsers = await this.prismaService.card.findUnique({
      where: {
        id: dto.cardId,
      },
      select: {
        users: true,
      },
    });
    return await this.prismaService.card.update({
      where: {
        id: dto.cardId,
      },
      data: {
        users: {
          set: cardUsers.users.filter((u) => u.id !== dto.userId),
        },
      },
    });
  }

  async editCardById(userId: number, cardId: number, dto: EditCardDto) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.card.update({
      where: {
        id: cardId,
      },
      data: {
        ...dto,
      },
    });
  }
}
