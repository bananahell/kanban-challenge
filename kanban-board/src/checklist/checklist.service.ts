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
    this.validationService.checkForCardUser(userId, cardId);
    return this.prismaService.checklist.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  async getChecklistById(userId: number, checklistId: number) {
    this.validationService.checkForChecklistUser(userId, checklistId);
    return this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
      },
    });
  }

  async createChecklist(userId: number, dto: CreateChecklistDto) {
    this.validationService.checkForCardUser(userId, dto.cardId);
    return this.prismaService.checklist.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteChecklistById(userId: number, checklistId: number) {
    this.validationService.checkForChecklistUser(userId, checklistId);
    return this.prismaService.checklist.delete({
      where: {
        id: checklistId,
      },
    });
  }

  async editChecklistById(userId: number, checklistId: number, dto: EditChecklistDto) {
    this.validationService.checkForChecklistUser(userId, checklistId);
    return this.prismaService.checklist.update({
      where: {
        id: checklistId,
      },
      data: {
        ...dto,
      },
    });
  }
}
