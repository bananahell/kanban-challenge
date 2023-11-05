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

  async getAttachmentsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.attachment.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  async getAttachmentById(userId: number, attachemntId: number) {
    await this.validationService.checkForAttachmentUser(userId, attachemntId);
    return await this.prismaService.attachment.findUnique({
      where: {
        id: attachemntId,
      },
    });
  }

  async createAttachment(userId: number, dto: CreateAttachmentDto) {
    await this.validationService.checkForCardUser(userId, dto.cardId);
    return await this.prismaService.attachment.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteAttachmentById(userId: number, attachemntId: number) {
    await this.validationService.checkForAttachmentUser(userId, attachemntId);
    return await this.prismaService.attachment.delete({
      where: {
        id: attachemntId,
      },
    });
  }

  async editAttachmentById(userId: number, attachemntId: number, dto: EditAttachmentDto) {
    await this.validationService.checkForAttachmentUser(userId, attachemntId);
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
