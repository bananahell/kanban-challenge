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

  getAttachmentsByCard(userId: number, cardId: number) {
    this.validationService.checkForCardUser(userId, cardId);
    return this.prismaService.attachment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  getAttachmentById(userId: number, attachemntId: number) {
    this.validationService.checkForAttachmentUser(userId, attachemntId);
    return this.prismaService.attachment.findUnique({
      where: {
        id: attachemntId,
      },
    });
  }

  async createAttachment(userId: number, dto: CreateAttachmentDto) {
    this.validationService.checkForCardUser(userId, dto.cardId);
    return this.prismaService.attachment.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteAttachmentById(userId: number, attachemntId: number) {
    this.validationService.checkForAttachmentUser(userId, attachemntId);
    return this.prismaService.attachment.delete({
      where: {
        id: attachemntId,
      },
    });
  }

  async editAttachmentById(userId: number, attachemntId: number, dto: EditAttachmentDto) {
    this.validationService.checkForAttachmentUser(userId, attachemntId);
    return this.prismaService.attachment.update({
      where: {
        id: attachemntId,
      },
      data: {
        ...dto,
      },
    });
  }
}
