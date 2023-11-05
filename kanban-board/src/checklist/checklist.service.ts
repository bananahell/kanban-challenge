import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateChecklistDto, EditChecklistDto } from './dto';

@Injectable()
export class ChecklistService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getChecklistsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.checklist.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  async getChecklistById(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistUser(userId, checklistId);
    return await this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
      },
    });
  }

  async createChecklist(userId: number, dto: CreateChecklistDto) {
    await this.validationService.checkForCardUser(userId, dto.cardId);
    return await this.prismaService.checklist.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteChecklistById(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistUser(userId, checklistId);
    return await this.prismaService.checklist.delete({
      where: {
        id: checklistId,
      },
    });
  }

  async editChecklistById(userId: number, checklistId: number, dto: EditChecklistDto) {
    await this.validationService.checkForChecklistUser(userId, checklistId);
    return await this.prismaService.checklist.update({
      where: {
        id: checklistId,
      },
      data: {
        ...dto,
      },
    });
  }
}
