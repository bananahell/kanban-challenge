import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateAttachmentDto, EditAttachmentDto } from './dto';

@Injectable()
export class AttachmentService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  /**
   * Get all attachments of a card.
   * @param userId Session user id.
   * @param cardId Id of card holder of the attachments.
   * @returns All attachments of a card.
   */
  async getAttachmentsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardVisitor(userId, cardId);
    return await this.prismaService.attachment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  /**
   * Gets one attachment by id.
   * @param userId Session user id.
   * @param attachemntId Id of the attachment to be searched.
   * @returns Attachment found.
   */
  async getAttachmentById(userId: number, attachemntId: number) {
    await this.validationService.checkForAttachmentVisitor(userId, attachemntId);
    return await this.prismaService.attachment.findUnique({
      where: {
        id: attachemntId,
      },
    });
  }

  /**
   * Creates a card's attachment in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns Newly created attachment.
   */
  async createAttachment(userId: number, dto: CreateAttachmentDto) {
    await this.validationService.checkForCardMember(userId, dto.cardId);
    return await this.prismaService.attachment.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a card's attachment from the database.
   * @param userId Session user id.
   * @param attachemntId Id of the attachment to be deleted.
   * @returns Nothing.
   */
  async deleteAttachmentById(userId: number, attachemntId: number) {
    await this.validationService.checkForAttachmentMember(userId, attachemntId);
    return await this.prismaService.attachment.delete({
      where: {
        id: attachemntId,
      },
    });
  }

  /**
   * Edits a card's attachment in the database.
   * @param userId Session user id.
   * @param attachemntId Id of the attachment to be edited.
   * @param dto Data from the controller.
   * @returns The just edited attachment.
   */
  async editAttachmentById(userId: number, attachemntId: number, dto: EditAttachmentDto) {
    await this.validationService.checkForAttachmentMember(userId, attachemntId);
    return await this.prismaService.attachment.update({
      where: {
        id: attachemntId,
      },
      data: {
        ...dto,
      },
    });
  }
}
