import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorMessages } from './error-msgs';
import { ManageBoardUserDto } from './board/dto';

@Injectable()
export class ValidationService {
  constructor(private prismaService: PrismaService) {}

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

  checkRemoveBoardOwner(userId: number, dto: ManageBoardUserDto) {
    if (userId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantRemoveOwnerUser);
    }
  }

  checkPassBoardOwnerToBoardOwner(ownerId: number, dto: ManageBoardUserDto) {
    if (ownerId === dto.userId) {
      throw new ForbiddenException(ErrorMessages.CantPassOwnerToOwner);
    }
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }
}
