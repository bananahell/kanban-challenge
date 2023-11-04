import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddUserDto, CreateBoardDto, EditBoardDto } from './dto';
import { ErrorMessages } from '../error-msgs';
import { ValidationService } from '../validation.service';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  getBoards(userId: number) {
    return this.prismaService.board.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  getBoardById(userId: number, boardId: number) {
    return this.prismaService.board.findFirst({
      where: {
        id: boardId,
        users: {
          some: {
            id: userId,
          },
        },
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
    this.validationService.checkForBoardOwner(userId, boardId).catch();
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
    this.validationService.checkForBoardOwner(userId, boardId).catch();
    await this.prismaService.board.delete({
      where: {
        id: boardId,
      },
    });
  }

  async addBoardUser(userId: number, dto: AddUserDto) {
    this.validationService.checkForBoardOwner(userId, dto.boardId).catch();
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
    this.validationService.checkForBoardOwner(userId, dto.boardId).catch();
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
    const board = await this.validationService.checkForBoardOwner(userId, dto.boardId).catch();
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
}
