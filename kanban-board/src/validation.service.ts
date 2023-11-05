import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorMessages } from './error-msgs';
import { ManageBoardUserDto } from './board/dto';

/**
 * Service used to validate a session user's ability to view or change the database's data.
 */
@Injectable()
export class ValidationService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Checks if a user is a board's owner.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user isn't its owner.
   */
  async checkForBoardOwner(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (board.ownerId != userId) {
      throw new ForbiddenException(ErrorMessages.NotAllowedToEdit);
    }
    return board;
  }

  /**
   * Checks if a user is a board's user.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user isn't its user.
   */
  async checkForBoardUser(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return board;
  }

  /**
   * Checks if board's owner is session user and trying to remove self.
   * @param userId Session user id.
   * @param dto Data from controller.
   */
  checkRemoveBoardOwner(userId: number, dto: ManageBoardUserDto) {
    if (userId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantRemoveOwnerUser);
    }
  }

  /**
   * Checks if a board's ownership is being passed to the own owner.
   * @param ownerId Board owner's id.
   * @param dto Data from controller.
   */
  checkPassBoardOwnerToBoardOwner(ownerId: number, dto: ManageBoardUserDto) {
    if (ownerId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantPassOwnerToOwner);
    }
  }

  /**
   * Checks if a user is a status list's board's user.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns The status list checked, forbidden exception if user isn't its user.
   */
  async checkForStatusListUser(userId: number, statusListId: number) {
    const statusList = await this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
        board: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });
    if (!statusList) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return statusList;
  }

  /**
   * Checks if a user is a card's board's user.
   * @param userId Session user id.
   * @param cardId Card's id
   * @returns The card checked, forbidden exception if user isn't its board's user.
   */
  async checkForCardUser(userId: number, cardId: number) {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: cardId,
        statusList: {
          board: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    });
    if (!card) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return card;
  }

  /**
   * Checks if a user is a checklist's board's user.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns The checklist checked, forbidden exception if user isn't its user.
   */
  async checkForChecklistUser(userId: number, checklistId: number) {
    const checklist = await this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
        card: {
          statusList: {
            board: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
        },
      },
    });
    if (!checklist) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return checklist;
  }

  /**
   * Check if a user is a checklist item's board's user.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @returns The checklist item checked, forbidden exception if user isn't its user.
   */
  async checkForChecklistItemUser(userId: number, checklistItemId: number) {
    const checklistItem = await this.prismaService.checklistItem.findUnique({
      where: {
        id: checklistItemId,
        checklist: {
          card: {
            statusList: {
              board: {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!checklistItem) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return checklistItem;
  }

  /**
   * Check if a user is a comment's board's user.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @returns The comment checked, forbidden exception if user isn't its user.
   */
  async checkForCommentUser(userId: number, commentId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
        card: {
          statusList: {
            board: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
        },
      },
    });
    if (!comment) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return comment;
  }

  /**
   * Checks if a user is a comment's creator.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @returns The comment checked, forbidden exception if user isn't its owner.
   */
  async checkForCommentOwner(userId: number, commentId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
        userId: userId,
      },
    });
    if (!comment) {
      throw new ForbiddenException(ErrorMessages.NotAllowedToEdit);
    }
    return comment;
  }

  /**
   * Checks if a user is an attachment's board's user.
   * @param userId Session user id.
   * @param attachmentId Attachment's id.
   * @returns The attachment checked, forbidden exception if user isn't its user.
   */
  async checkForAttachmentUser(userId: number, attachmentId: number) {
    const attachment = await this.prismaService.attachment.findUnique({
      where: {
        id: attachmentId,
        card: {
          statusList: {
            board: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
        },
      },
    });
    if (!attachment) {
      throw new ForbiddenException(ErrorMessages.UserNotInBoard);
    }
    return attachment;
  }
}
