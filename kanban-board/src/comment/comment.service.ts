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

  getUserComments(userId: number) {
    return this.prismaService.comment.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getCardComments(userId: number, cardId: number) {
    this.validationService.checkForCardUser(userId, cardId);
    return this.prismaService.comment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  async getCommentById(userId: number, commentId: number) {
    this.validationService.checkForCommentUser(userId, commentId);
    return this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  async createComment(userId: number, dto: CreateCommentDto) {
    this.validationService.checkForCardUser(userId, dto.cardId);
    return this.prismaService.comment.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
  }

  async deleteCommentById(userId: number, commentId: number) {
    this.validationService.checkForCommentOwner(userId, commentId);
    return this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async editCommentById(userId: number, commentId: number, dto: EditCommentDto) {
    this.validationService.checkForCommentOwner(userId, commentId);
    return this.prismaService.comment.update({
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
