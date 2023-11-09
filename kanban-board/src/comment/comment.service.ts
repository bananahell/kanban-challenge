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

  /**
   * Gets all the comments made by the session's user.
   * @param userId Session user id.
   * @returns All comments made by the user.
   */
  async getUserComments(userId: number) {
    return await this.prismaService.comment.findMany({
      where: {
        userId: userId,
      },
    });
  }

  /**
   * Get every comment inside a card.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @returns All comments made in a card.
   */
  async getCardComments(userId: number, cardId: number) {
    await this.validationService.checkForCardVisitor(userId, cardId);
    return await this.prismaService.comment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  /**
   * Gets a comment by its id.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @returns The comment found.
   */
  async getCommentById(userId: number, commentId: number) {
    await this.validationService.checkForCommentVisitor(userId, commentId);
    return await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  /**
   * Creates a comment in a card under the session user's name.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created comment.
   */
  async createComment(userId: number, dto: CreateCommentDto) {
    await this.validationService.checkForCardVisitor(userId, dto.cardId);
    return await this.prismaService.comment.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
  }

  /**
   * Deletes a comment by its id.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @returns Nothing.
   */
  async deleteCommentById(userId: number, commentId: number) {
    await this.validationService.checkForCommentOwner(userId, commentId);
    return await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  /**
   * Edit's a comment by its id.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @param dto Data from controller.
   * @returns The just added comment.
   */
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
