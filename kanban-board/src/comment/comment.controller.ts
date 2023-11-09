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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('comments')
@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async getUserComments(@GetUser('id') userId: number) {
    return await this.commentService.getUserComments(userId);
  }

  @Get('card/:id')
  async getCardComments(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return await this.commentService.getCardComments(userId, cardId);
  }

  @Get(':id')
  async getCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.getCommentById(userId, commentId);
  }

  @Post()
  async createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
    return await this.commentService.createComment(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.deleteCommentById(userId, commentId);
  }

  @Patch(':id')
  async editCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() dto: EditCommentDto,
  ) {
    return await this.commentService.editCommentById(userId, commentId, dto);
  }
}
