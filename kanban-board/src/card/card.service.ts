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

  /**
   * Gets all cards the session user is a part of in each card's user array.
   * @param userId Session user id.
   * @returns All cards the user is in.
   */
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

  /**
   * Get all cards inside of a board's status list.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns All cards inside the status list.
   */
  async getCardsOfStatusList(userId: number, statusListId: number) {
    await this.validationService.checkForStatusListUser(userId, statusListId);
    return await this.prismaService.card.findMany({
      where: {
        statusListId: statusListId,
      },
    });
  }

  /**
   * Get all cards inside of a board.
   * @param userId Session user id.
   * @param boardId Board's id
   * @returns All cards inside the board.
   */
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

  /**
   * Get a card by its id.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @returns The card with the specified id.
   */
  async getCardById(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
    });
  }

  /**
   * Creates a card in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created card.
   */
  async createCard(userId: number, dto: CreateCardDto) {
    await this.validationService.checkForStatusListUser(userId, dto.statusListId);
    return await this.prismaService.card.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a card by its id.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @returns Nothing.
   */
  async deleteCardById(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.card.delete({
      where: {
        id: cardId,
      },
    });
  }

  /**
   * Adds user to a card's user array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The card updated with the new user.
   */
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

  /**
   * Removes user from a card's user array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The card updated without the removed user.
   */
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

  /**
   * Edits a card by its id.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @param dto Data from controller.
   * @returns The just edited card.
   */
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
