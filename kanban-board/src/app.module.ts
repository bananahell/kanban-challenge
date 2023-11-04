import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { StatusListModule } from './status-list/status-list.module';
import { CardModule } from './card/card.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ChecklistItemModule } from './checklist-item/checklist-item.module';
import { AttachmentModule } from './attachment/attachment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    BoardModule,
    StatusListModule,
    CardModule,
    TagModule,
    CommentModule,
    ChecklistModule,
    ChecklistItemModule,
    AttachmentModule,
  ],
})
export class AppModule {}
