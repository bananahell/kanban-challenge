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

  /**
   * Get all checklists in a card.
   * @param userId Session user id.
   * @param cardId Card's id.
   * @returns All checklists inside a card.
   */
  async getChecklistsByCard(userId: number, cardId: number) {
    await this.validationService.checkForCardVisitor(userId, cardId);
    return await this.prismaService.checklist.findMany({
      where: {
        cardId: cardId,
      },
    });
  }

  /**
   * Get a checklist by its id.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns The checklist found.
   */
  async getChecklistById(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistVisitor(userId, checklistId);
    return await this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
      },
    });
  }

  /**
   * Creates a checklist in a card in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created checklist.
   */
  async createChecklist(userId: number, dto: CreateChecklistDto) {
    await this.validationService.checkForCardMember(userId, dto.cardId);
    return await this.prismaService.checklist.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a checklist by its id.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns Nothing.
   */
  async deleteChecklistById(userId: number, checklistId: number) {
    await this.validationService.checkForChecklistMember(userId, checklistId);
    return await this.prismaService.checklist.delete({
      where: {
        id: checklistId,
      },
    });
  }

  /**
   * Edits a checklist by its id.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @param dto Data from controller.
   * @returns The just edited checklist.
   */
  async editChecklistById(userId: number, checklistId: number, dto: EditChecklistDto) {
    await this.validationService.checkForChecklistMember(userId, checklistId);
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
