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
   * Checks if a user is already a board's user.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user is its user.
   */
  async checkForBoardAlreadyUser(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        admins: true,
        members: true,
        visitors: true,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (
      board.admins.find((admin) => admin.id === userId) ||
      board.members.find((member) => member.id === userId) ||
      board.members.find((visitor) => visitor.id === userId)
    ) {
      throw new ForbiddenException(ErrorMessages.UserAlreadyBoardUser);
    }
    return board;
  }

  /**
   * Checks if a user is a board's owner.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user isn't its owner.
   */
  async checkForBoardAdmin(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        admins: true,
        ownerId: true,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (!board.admins.find((admin) => admin.id === userId)) {
      throw new ForbiddenException(ErrorMessages.UserNotBoardAdmin);
    }
    return board;
  }

  /**
   * Checks if a user is a board's member.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user isn't its member.
   */
  async checkForBoardMember(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        admins: true,
        members: true,
        id: true,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (
      !board.admins.find((admin) => admin.id === userId) &&
      !board.members.find((member) => member.id === userId)
    ) {
      throw new ForbiddenException(ErrorMessages.UserNotBoardMember);
    }
    return board;
  }

  /**
   * Checks if a user is a board's visitor.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board checked, forbidden exception if user isn't its visitor.
   */
  async checkForBoardVisitor(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        admins: true,
        members: true,
        visitors: true,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (
      !board.admins.find((admin) => admin.id === userId) &&
      !board.members.find((member) => member.id === userId) &&
      !board.members.find((visitor) => visitor.id === userId)
    ) {
      throw new ForbiddenException(ErrorMessages.UserNotBoardVisitor);
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
   * Checks if the user about to have their role changed in a board is the board's owner.
   * @param userId User's id.
   * @param boardId Board's id.
   * @returns The board searched, forbidden exception if owner found.
   */
  async checkChangeBoardOwnerRole(userId: number, boardId: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        ownerId: true,
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (board.ownerId === userId) {
      throw new ForbiddenException(ErrorMessages.CannotChangeOwnerRole);
    }
    return board;
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
   * Checks if a user is a status list's board's member.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns The board of the status list checked, forbidden exception if user isn't its member.
   */
  async checkForStatusListMember(userId: number, statusListId: number) {
    const statusList = await this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
      },
    });
    if (!statusList) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardMember(userId, statusList.boardId);
  }

  /**
   * Checks if a user is a status list's board's visitor.
   * @param userId Session user id.
   * @param statusListId Status list's id.
   * @returns The board of the status list checked, forbidden exception if user isn't its visitor.
   */
  async checkForStatusListVisitor(userId: number, statusListId: number) {
    const statusList = await this.prismaService.statusList.findUnique({
      where: {
        id: statusListId,
      },
    });
    if (!statusList) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, statusList.boardId);
  }

  /**
   * Checks new position of status list isn't already taken in the board.
   * @param boardId Status list's board id.
   * @param position New position of status list.
   * @returns The status list's board, forbidden exception if status list position is taken.
   */
  async checkForExistingPositionedStatusList(boardId: number, position: number) {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        statusLists: {
          select: {
            position: true,
          },
        },
      },
    });
    if (!board) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (board.statusLists.find((statusList) => statusList.position === position)) {
      throw new ForbiddenException(ErrorMessages.StatusListPositionTaken);
    }
    return board;
  }

  /**
   * Checks if a user is a card's board's member.
   * @param userId Session user id.
   * @param cardId Card's id
   * @returns The board of the card checked, forbidden exception if user isn't its board's member.
   */
  async checkForCardMember(userId: number, cardId: number) {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
      select: {
        statusList: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!card) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardMember(userId, card.statusList.boardId);
  }

  /**
   * Checks if a user is a card's board's visitor.
   * @param userId Session user id.
   * @param cardId Card's id
   * @returns The board of the card checked, forbidden exception if user isn't its board's visitor.
   */
  async checkForCardVisitor(userId: number, cardId: number) {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
      select: {
        statusList: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!card) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, card.statusList.boardId);
  }

  /**
   * Checks if a user is a checklist's board's member.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns The board of the checklist checked, forbidden exception if user isn't its member.
   */
  async checkForChecklistMember(userId: number, checklistId: number) {
    const checklist = await this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
      },
      select: {
        card: {
          select: {
            statusList: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!checklist) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardMember(userId, checklist.card.statusList.boardId);
  }

  /**
   * Checks if a user is a checklist's board's visitor.
   * @param userId Session user id.
   * @param checklistId Checklist's id.
   * @returns The board of the checklist checked, forbidden exception if user isn't its visitor.
   */
  async checkForChecklistVisitor(userId: number, checklistId: number) {
    const checklist = await this.prismaService.checklist.findUnique({
      where: {
        id: checklistId,
      },
      select: {
        card: {
          select: {
            statusList: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!checklist) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, checklist.card.statusList.boardId);
  }

  /**
   * Check if a user is a checklist item's board's member.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @returns The board of the checklist item checked, forbidden exception if user isn't its member.
   */
  async checkForChecklistItemMember(userId: number, checklistItemId: number) {
    const checklistItem = await this.prismaService.checklistItem.findUnique({
      where: {
        id: checklistItemId,
      },
      select: {
        checklist: {
          select: {
            card: {
              select: {
                statusList: {
                  select: {
                    boardId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!checklistItem) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardMember(userId, checklistItem.checklist.card.statusList.boardId);
  }

  /**
   * Check if a user is a checklist item's board's visitor.
   * @param userId Session user id.
   * @param checklistItemId Checklist item's id.
   * @returns The board of the checklist item checked, forbidden exception if user isn't its visitor.
   */
  async checkForChecklistItemVisitor(userId: number, checklistItemId: number) {
    const checklistItem = await this.prismaService.checklistItem.findUnique({
      where: {
        id: checklistItemId,
      },
      select: {
        checklist: {
          select: {
            card: {
              select: {
                statusList: {
                  select: {
                    boardId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!checklistItem) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, checklistItem.checklist.card.statusList.boardId);
  }

  /**
   * Check if a user is a comment's board's visitor.
   * @param userId Session user id.
   * @param commentId Comment's id.
   * @returns The board of the comment checked, forbidden exception if user isn't its visitor.
   */
  async checkForCommentVisitor(userId: number, commentId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        card: {
          select: {
            statusList: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!comment) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, comment.card.statusList.boardId);
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
      },
      select: {
        userId: true,
      },
    });
    if (!comment) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException(ErrorMessages.NotAllowedToEdit);
    }
    return comment;
  }

  /**
   * Checks if a user is an attachment's board's member.
   * @param userId Session user id.
   * @param attachmentId Attachment's id.
   * @returns The board of the attachment checked, forbidden exception if user isn't its member.
   */
  async checkForAttachmentMember(userId: number, attachmentId: number) {
    const attachment = await this.prismaService.attachment.findUnique({
      where: {
        id: attachmentId,
      },
      select: {
        card: {
          select: {
            statusList: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!attachment) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardMember(userId, attachment.card.statusList.boardId);
  }

  /**
   * Checks if a user is an attachment's board's visitor.
   * @param userId Session user id.
   * @param attachmentId Attachment's id.
   * @returns The board of the attachment checked, forbidden exception if user isn't its visitor.
   */
  async checkForAttachmentVisitor(userId: number, attachmentId: number) {
    const attachment = await this.prismaService.attachment.findUnique({
      where: {
        id: attachmentId,
      },
      select: {
        card: {
          select: {
            statusList: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!attachment) {
      throw new ForbiddenException(ErrorMessages.ResourceNotFound);
    }
    return await this.checkForBoardVisitor(userId, attachment.card.statusList.boardId);
  }
}
