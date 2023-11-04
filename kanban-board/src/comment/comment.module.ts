import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ValidationService } from '../validation.service';

@Module({
  providers: [CommentService, ValidationService],
  controllers: [CommentController],
})
export class CommentModule {}
