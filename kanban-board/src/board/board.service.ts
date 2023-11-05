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
        users: {
          some: {
            id: userId,
          },
        },
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
    await this.validationService.checkForBoardUser(userId, boardId);
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
    const board = await this.prismaService.board.create({
      data: {
        ownerId: userId,
        ...dto,
      },
    });
    return await this.addBoardUser(userId, { userId: userId, boardId: board.id });
  }

  /**
   * Edits a board in the database.
   * @param userId Session user id.
   * @param boardId Board's id.
   * @param dto Data from controller.
   * @returns The just edited board.
   */
  async editBoardById(userId: number, boardId: number, dto: EditBoardDto) {
    await this.validationService.checkForBoardOwner(userId, boardId);
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
    await this.validationService.checkForBoardOwner(userId, boardId);
    return await this.prismaService.board.delete({
      where: {
        id: boardId,
      },
    });
  }

  /**
   * Adds a user to a board's user array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated with the new user.
   */
  async addBoardUser(userId: number, dto: ManageBoardUserDto) {
    await this.validationService.checkForBoardOwner(userId, dto.boardId);
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
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
   * Removes a user from a board's user array.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The board updated without the deleted user.
   */
  async removeBoardUser(userId: number, dto: ManageBoardUserDto) {
    this.validationService.checkRemoveBoardOwner(userId, dto);
    await this.validationService.checkForBoardOwner(userId, dto.boardId);
    const boardUsers = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
      },
      select: {
        users: true,
      },
    });
    return await this.prismaService.board.update({
      where: {
        id: dto.boardId,
      },
      data: {
        users: {
          set: boardUsers.users.filter((u) => u.id !== dto.userId),
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
    const board = await this.validationService.checkForBoardOwner(userId, dto.boardId);
    this.validationService.checkPassBoardOwnerToBoardOwner(board.ownerId, dto);
    this.addBoardUser(userId, dto);
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
