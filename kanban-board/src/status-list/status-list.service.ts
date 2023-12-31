import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessages } from '../error-msgs';
import { CreateStatusListDto, EditStatusListDto } from './dto';
import { ValidationService } from '../validation.service';

@Injectable()
export class StatusListService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  /**
   * Gets a status list by its id.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns The found status list.
   */
  async getStatusListById(userId: number, statusListId: number) {
    await this.validationService.checkForStatusListVisitor(userId, statusListId);
    return await this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
      },
    });
  }

  /**
   * Get all the status lists of a board.
   * @param userId Session user id.
   * @param boardId Board's id.
   * @returns All the status lists of the board.
   */
  async getStatusListsOfBoard(userId: number, boardId: number) {
    await this.validationService.checkForBoardVisitor(userId, boardId);
    return await this.prismaService.statusList.findMany({
      where: {
        boardId: boardId,
      },
    });
  }

  /**
   * Creates a board's status list in the database.
   * @param userId Session user id.
   * @param dto Data from controller.
   * @returns The newly created status list.
   */
  async createStatusList(userId: number, dto: CreateStatusListDto) {
    await this.validationService.checkForBoardMember(userId, dto.boardId);
    await this.validationService.checkForExistingPositionedStatusList(dto.boardId, dto.position);
    return await this.prismaService.statusList.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a status list by its id.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns Nothing.
   */
  async deleteStatusListById(userId: number, statusListId: number) {
    await this.validationService.checkForBoardMember(userId, statusListId);
    return await this.prismaService.statusList.delete({
      where: {
        id: statusListId,
      },
    });
  }

  /**
   * Edits a status list by its id.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @param dto Data from controller.
   * @returns The just edited status list.
   */
  async editStatusListById(userId: number, statusListId: number, dto: EditStatusListDto) {
    const board = await this.validationService.checkForStatusListMember(userId, statusListId);
    await this.validationService.checkForExistingPositionedStatusList(board.id, dto.position);
    return await this.prismaService.statusList.update({
      where: {
        id: statusListId,
      },
      data: {
        ...dto,
      },
    });
  }
}
