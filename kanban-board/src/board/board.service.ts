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

  async getBoardById(userId: number, boardId: number) {
    await this.validationService.checkForBoardUser(userId, boardId);
    return await this.prismaService.board.findFirst({
      where: {
        id: boardId,
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
    return await this.addBoardUser(userId, { userId: userId, boardId: board.id });
  }

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

  async deleteBoardById(userId: number, boardId: number) {
    await this.validationService.checkForBoardOwner(userId, boardId);
    return await this.prismaService.board.delete({
      where: {
        id: boardId,
      },
    });
  }

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
