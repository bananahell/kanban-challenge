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

  /**
   * Gets all the checklist items inside a card's checklist.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns All the checklist items inside the checklist.
   */
  async getChecklistItemsByChecklist(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistVisitor(userId, checklistId);
    return await this.prismaService.checklistItem.findMany({
      where: {
        checklistId: checklistId,
      },
    });
  }

  /**
   * Gets all the checklist items inside each checklist in a card.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @returns All the checklist items inside the card's checklists.
   */
  async getChecklistItemsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardVisitor(userId, cardId);
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

  /**
   * Gets a checklist item by its id.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @returns The checklist item found.
   */
  async getChecklistItemsById(userId: number, checklistItemId: number) {
    await this.validationService.checkForChecklistItemVisitor(userId, checklistItemId);
    return await this.prismaService.checklistItem.findUnique({
      where: {
        id: checklistItemId,
      },
    });
  }

  /**
   * Creates an item inside a card's checklist in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created checklist item.
   */
  async createChecklistItem(userId: number, dto: CreateChecklistItemDto) {
    await this.validationService.checkForChecklistMember(userId, dto.checklistId);
    return await this.prismaService.checklistItem.create({
      data: {
        isDone: false,
        ...dto,
      },
    });
  }

  /**
   * Deletes a checklist's item from a card in the database.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @returns Nothing.
   */
  async deleteChecklistItemById(userId: number, checklistItemId: number) {
    await this.validationService.checkForChecklistItemMember(userId, checklistItemId);
    return await this.prismaService.checklistItem.delete({
      where: {
        id: checklistItemId,
      },
    });
  }

  /**
   * Edits a checklist item by its id.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @param dto Data from controller.
   * @returns The just edited checklist item.
   */
  async editChecklistItemById(userId: number, checklistItemId: number, dto: EditChecklistItemDto) {
    await this.validationService.checkForChecklistItemMember(userId, checklistItemId);
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
