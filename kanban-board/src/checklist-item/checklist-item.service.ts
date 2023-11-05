import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';
import { CreateChecklistItemDto, EditChecklistItemDto } from './dto';

@Injectable()
export class ChecklistItemService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getChecklistItemsByChecklist(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistUser(userId, checklistId);
    return await this.prismaService.checklistItem.findMany({
      where: {
        checklistId: checklistId,
      },
    });
  }

  async getChecklistItemsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardUser(userId, cardId);
    return await this.prismaService.checklistItem.findMany({
      where: {
        checklist: {
          card: {
            id: cardId,
          },
        },
      },
    });
  }

  async getChecklistItemsById(userId: number, checklistItemId: number) {
    await this.validationService.checkForChecklistItemUser(userId, checklistItemId);
    return await this.prismaService.checklistItem.findUnique({
      where: {
        id: checklistItemId,
      },
    });
  }

  async createChecklistItem(userId: number, dto: CreateChecklistItemDto) {
    await this.validationService.checkForChecklistUser(userId, dto.checklistId);
    return await this.prismaService.checklistItem.create({
      data: {
        isDone: false,
        ...dto,
      },
    });
  }

  async deleteChecklistItemById(userId: number, checklistItemId: number) {
    await this.validationService.checkForChecklistItemUser(userId, checklistItemId);
    return await this.prismaService.checklistItem.delete({
      where: {
        id: checklistItemId,
      },
    });
  }
  async editChecklistItemById(userId: number, checklistItemId: number, dto: EditChecklistItemDto) {
    await this.validationService.checkForChecklistItemUser(userId, checklistItemId);
    return await this.prismaService.checklistItem.update({
      where: {
        id: checklistItemId,
      },
      data: {
        ...dto,
      },
    });
  }
}
