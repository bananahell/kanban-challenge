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
import { ChecklistItemService } from './checklist-item.service';
import { GetUser } from '../auth/decorator';
import { CreateChecklistItemDto, EditChecklistItemDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('checklist-items')
@UseGuards(JwtGuard)
@Controller('checklist-items')
export class ChecklistItemController {
  constructor(private checklistItemService: ChecklistItemService) {}

  @Get('checklist/:id')
  async getChecklistItemsByChecklist(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
  ) {
    return await this.checklistItemService.getChecklistItemsByChecklist(userId, checklistId);
  }

  @Get('card/:id')
  async getChecklistItemsByCard(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    return await this.checklistItemService.getChecklistItemsByCard(userId, cardId);
  }

  @Get(':id')
  async getChecklistItemsById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
  ) {
    return await this.checklistItemService.getChecklistItemsById(userId, checklistItemId);
  }

  @Post()
  async createChecklistItem(@GetUser('id') userId: number, @Body() dto: CreateChecklistItemDto) {
    return await this.checklistItemService.createChecklistItem(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteChecklistItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
  ) {
    return await this.checklistItemService.deleteChecklistItemById(userId, checklistItemId);
  }

  @Patch(':id')
  async editChecklistItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
    @Body() dto: EditChecklistItemDto,
  ) {
    return await this.checklistItemService.editChecklistItemById(userId, checklistItemId, dto);
  }
}
