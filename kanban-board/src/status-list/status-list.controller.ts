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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('status-lists')
@UseGuards(JwtGuard)
@Controller('status-lists')
export class StatusListController {
  constructor(private statusListService: StatusListService) {}

  @Get('board/:id')
  async getStatusListsOfBoard(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return await this.statusListService.getStatusListsOfBoard(userId, boardId);
  }

  @Get(':id')
  async getStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    return await this.statusListService.getStatusListById(userId, statusListId);
  }

  @Post()
  async createStatusList(@GetUser('id') userId: number, @Body() dto: CreateStatusListDto) {
    return await this.statusListService.createStatusList(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    return await this.statusListService.deleteStatusListById(userId, statusListId);
  }

  @Patch(':id')
  async editStatusListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
    @Body() dto: EditStatusListDto,
  ) {
    return await this.statusListService.editStatusListById(userId, statusListId, dto);
  }
}
