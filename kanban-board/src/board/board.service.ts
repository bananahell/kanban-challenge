import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManageBoardUserDto, CreateBoardDto, EditBoardDto } from './dto';
import { ValidationService } from '../validation.service';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  /**
   * Get all boards visible to user.
   * @param userId Session user id.
   * @returns All boards visible to the user.
   */
  async getBoards(userId: number) {
    return await this.prismaService.board.findMany({
      where: {
        OR: [
          {
            admins: {
              some: {
                id: userId,
              },
            },
            members: {
              some: {
                id: userId,
              },
            },
            visitors: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  }

  /**
   * Get one board by its id.
   * @param userId Session user id.
   * @param boardId Board's id.
   * @returns The board searched.
   */
  async getBoardById(userId: number, boardId: number) {
    await this.validationService.checkForBoardVisitor(userId, boardId);
    return await this.prismaService.board.findFirst({
      where: {
        id: boardId,
      },
    });
  }

  /**
   * Creates a board in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created board.
   */
  async createBoard(userId: number, dto: CreateBoardDto) {
    return await this.prismaService.board.create({
      data: {
        ownerId: userId,
        ...dto,
        admins: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * Edits a board in the database.
   * @param userId Session user id.
   * @param boardId Board's id.
   * @param dto Data from controller.
   * @returns The just edited board.
   */
  async editBoardById(userId: number, boardId: number, dto: EditBoardDto) {
    await this.validationService.checkForBoardAdmin(userId, boardId);
    return await this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a board from the database.
   * @param userId Session user id.
   * @param boardId Board's id.
   * @returns Nothing.
   */
  async deleteBoardById(userId: number, boardId: number) {
    await this.validationService.checkForBoardAdmin(userId, boardId);
    return await this.prismaService.board.delete({
      where: {
        id: boardId,
      },
    });
  }

  /**
   * Adds a user to a board's admins array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated with the new admin.
   */
  async addBoardAdmin(userId: number, dto: ManageBoardUserDto) {
    await this.validationService.checkForBoardAdmin(userId, dto.boardId);
    await this.validationService.checkForBoardAlreadyUser(dto.userId, dto.boardId);
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        admins: {
          connect: {
            id: dto.userId,
          },
        },
      },
    });
  }

  /**
   * Adds a user to a board's member array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated with the new member.
   */
  async addBoardMember(userId: number, dto: ManageBoardUserDto) {
    await this.validationService.checkForBoardAdmin(userId, dto.boardId);
    await this.validationService.checkForBoardAlreadyUser(dto.userId, dto.boardId);
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        members: {
          connect: {
            id: dto.userId,
          },
        },
      },
    });
  }

  /**
   * Adds a user to a board's user visitor.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated with the new visitor.
   */
  async addBoardVisitor(userId: number, dto: ManageBoardUserDto) {
    await this.validationService.checkForBoardAdmin(userId, dto.boardId);
    await this.validationService.checkForBoardAlreadyUser(dto.userId, dto.boardId);
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        visitors: {
          connect: {
            id: dto.userId,
          },
        },
      },
    });
  }

  /**
   * Removes user id from the user array in each card inside a board.
   * @param userId Id of user to be removed.
   * @param boardId Board's id.
   */
  async removeUserFromAllBoardCards(userId: number, boardId: number) {
    const cardUsers = await this.prismaService.card.findMany({
      where: {
        statusList: {
          board: {
            id: boardId,
          },
        },
      },
      select: {
        id: true,
        users: true,
      },
    });
    cardUsers.forEach(async (u) => {
      await this.prismaService.card.update({
        where: {
          id: u.id,
        },
        data: {
          users: {
            set: u.users.filter((u) => u.id !== userId),
          },
        },
      });
    });
  }

  /**
   * Removes a user from any of the board's arrays and also each of its cards' user arrays.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated without the deleted admin.
   */
  async removeBoardUser(userId: number, dto: ManageBoardUserDto) {
    this.validationService.checkRemoveBoardOwner(userId, dto);
    await this.validationService.checkForBoardAdmin(userId, dto.boardId);
    await this.removeUserFromAllBoardCards(dto.userId, dto.boardId);
    const boardUsers = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
      },
      select: {
        admins: true,
        members: true,
        visitors: true,
      },
    });
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        admins: {
          set: boardUsers.admins.filter((admin) => admin.id !== dto.userId),
        },
        members: {
          set: boardUsers.members.filter((member) => member.id !== dto.userId),
        },
        visitors: {
          set: boardUsers.visitors.filter((visitor) => visitor.id !== dto.userId),
        },
      },
    });
  }

  /**
   * Grants ownership of a board to a user.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board with its updated owner.
   */
  async passOwnership(userId: number, dto: ManageBoardUserDto) {
    const board = await this.validationService.checkForBoardAdmin(userId, dto.boardId);
    this.validationService.checkPassBoardOwnerToBoardOwner(board.ownerId, dto);
    await this.addBoardAdmin(userId, dto);
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        ownerId: dto.userId,
      },
    });
  }
}
