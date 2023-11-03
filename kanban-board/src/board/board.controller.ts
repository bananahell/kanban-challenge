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
import { GetUser } from '../auth/decorator';
import { BoardService } from './board.service';
import { JwtGuard } from '../auth/guard';
import { AddUserDto, CreateBoardDto, EditBoardDto } from './dto';

@UseGuards(JwtGuard)
@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  getBoards(@GetUser('id') userId: number) {
    return this.boardService.getBoards(userId);
  }

  @Get(':id')
  getBoardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return this.boardService.getBoardById(userId, boardId);
  }

  @Post()
  createBoard(@GetUser('id') userId: number, @Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBoardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return this.boardService.deleteBoardById(userId, boardId);
  }

  @Patch('add-user')
  addBoardUser(@GetUser('id') userId: number, @Body() dto: AddUserDto) {
    return this.boardService.addBoardUser(userId, dto);
  }

  @Patch('remove-user')
  removeBoardUser(@GetUser('id') userId: number, @Body() dto: AddUserDto) {
    return this.boardService.removeBoardUser(userId, dto);
  }

  @Patch('pass-owner')
  passOwnership(@GetUser('id') userId: number, @Body() dto: AddUserDto) {
    return this.boardService.passOwnership(userId, dto);
  }

  @Patch(':id')
  editBoardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
    @Body() dto: EditBoardDto,
  ) {
    return this.boardService.editBoardById(userId, boardId, dto);
  }
}
