import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CommentService } from './comment.service';
import { GetUser } from '../auth/decorator';
import { CreateCommentDto, EditCommentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  getUserComments(@GetUser('id') userId: number) {
    return this.commentService.getUserComments(userId);
  }

  @Get('card/:id')
  getCardComments(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return this.commentService.getCardComments(userId, cardId);
  }

  @Get(':id')
  getCommentById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) commentId: number) {
    return this.commentService.getCommentById(userId, commentId);
  }

  @Post()
  createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentService.createComment(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCommentById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) commentId: number) {
    return this.commentService.deleteCommentById(userId, commentId);
  }

  @Patch(':id')
  editCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() dto: EditCommentDto,
  ) {
    return this.commentService.editCommentById(userId, commentId, dto);
  }
}
