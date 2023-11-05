import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateCommentDto, EditCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getUserComments(userId: number) {
    return await this.prismaService.comment.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getCardComments(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.comment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  async getCommentById(userId: number, commentId: number) {
    await this.validationService.checkForCommentUser(userId, commentId);
    return await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  async createComment(userId: number, dto: CreateCommentDto) {
    await this.validationService.checkForCardUser(userId, dto.cardId);
    return await this.prismaService.comment.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
  }

  async deleteCommentById(userId: number, commentId: number) {
    await this.validationService.checkForCommentOwner(userId, commentId);
    return await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async editCommentById(userId: number, commentId: number, dto: EditCommentDto) {
    await this.validationService.checkForCommentOwner(userId, commentId);
    return await this.prismaService.comment.update({
      where: {
        id: commentId,
        userId: userId,
      },
      data: {
        ...dto,
      },
    });
  }
}
