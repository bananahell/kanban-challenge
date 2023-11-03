import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddUserDto, CreateBoardDto, EditBoardDto } from './dto';
import { ErrorMessages } from '../error-msgs';

@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  getBoards(userId: number) {
    return this.prismaService.board.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  getBoardById(userId: number, boardId: number) {
    return this.prismaService.board.findFirst({
      where: {
        id: boardId,
        ownerId: userId,
      },
    });
  }

  async createBoard(userId: number, dto: CreateBoardDto) {
    const board = await this.prismaService.board.create({
      data: {
        ownerId: userId,
        ...dto,
      },
    });
    return this.addBoardUser(userId, { userId: userId, boardId: board.id });
  }

  async editBoardById(userId: number, boardId: number, dto: EditBoardDto) {
    this.checkForBoard(userId, boardId).catch();
    return this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBoardById(userId: number, boardId: number) {
    this.checkForBoard(userId, boardId).catch();
    await this.prismaService.board.delete({
      where: {
        id: boardId,
      },
    });
  }

  async addBoardUser(userId: number, dto: AddUserDto) {
    this.checkForBoard(userId, dto.boardId).catch();
    return this.prismaService.board.update({
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

  async removeBoardUser(userId: number, dto: AddUserDto) {
    if (userId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantRemoveOwnerUser);
    }
    this.checkForBoard(userId, dto.boardId).catch();
    const boardUsers = await this.prismaService.board.findUnique({
      where: {
        id: dto.boardId,
      },
      select: {
        users: true,
      },
    });
    return this.prismaService.board.update({
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

  async passOwnership(userId: number, dto: AddUserDto) {
    const board = await this.checkForBoard(userId, dto.boardId).catch();
    if (board.ownerId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantPassOwnerToOwner);
    }
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
