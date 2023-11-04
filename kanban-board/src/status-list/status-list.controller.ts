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
import { StatusListService } from './status-list.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateStatusListDto, EditStatusListDto } from './dto';

@UseGuards(JwtGuard)
@Controller('status-lists')
export class StatusListController {
  constructor(private statusListService: StatusListService) {}

  @Get('board/:id')
  getStatusListsOfBoard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    this.statusListService.getStatusListsOfBoard(userId, boardId);
  }

  @Get(':id')
  getStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    this.statusListService.getStatusListById(userId, statusListId);
  }

  @Post()
  createStatusList(@GetUser('id') userId: number, @Body() dto: CreateStatusListDto) {
    return this.statusListService.createStatusList(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    return this.statusListService.deleteStatusListById(userId, statusListId);
  }

  @Patch(':id')
  editStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
    @Body() dto: EditStatusListDto,
  ) {
    this.statusListService.editStatusListById(userId, statusListId, dto);
  }
}
