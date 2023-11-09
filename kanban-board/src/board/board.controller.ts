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
import { ManageBoardUserDto, CreateBoardDto, EditBoardDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('boards')
@UseGuards(JwtGuard)
@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @ApiBearerAuth()
  @Get()
  getBoards(@GetUser('id') userId: number) {
    return this.boardService.getBoards(userId);
  }

  @ApiBearerAuth()
  @Get(':id')
  getBoardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return this.boardService.getBoardById(userId, boardId);
  }

  @ApiBearerAuth()
  @Post()
  createBoard(@GetUser('id') userId: number, @Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(userId, dto);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBoardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return await this.boardService.deleteBoardById(userId, boardId);
  }

  @ApiBearerAuth()
  @Patch('add-admin')
  async addBoardAdmin(@GetUser('id') userId: number, @Body() dto: ManageBoardUserDto) {
    return await this.boardService.addBoardAdmin(userId, dto);
  }

  @ApiBearerAuth()
  @Patch('add-member')
  async addBoardMember(@GetUser('id') userId: number, @Body() dto: ManageBoardUserDto) {
    return await this.boardService.addBoardMember(userId, dto);
  }

  @ApiBearerAuth()
  @Patch('add-visitor')
  async addBoardVisitor(@GetUser('id') userId: number, @Body() dto: ManageBoardUserDto) {
    return await this.boardService.addBoardVisitor(userId, dto);
  }

  @ApiBearerAuth()
  @Patch('remove-user')
  async removeBoardUser(@GetUser('id') userId: number, @Body() dto: ManageBoardUserDto) {
    return await this.boardService.removeBoardUser(userId, dto);
  }

  @ApiBearerAuth()
  @Patch('pass-owner')
  async passOwnership(@GetUser('id') userId: number, @Body() dto: ManageBoardUserDto) {
    return await this.boardService.passOwnership(userId, dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  async editBoardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
    @Body() dto: EditBoardDto,
  ) {
    return await this.boardService.editBoardById(userId, boardId, dto);
  }
}
