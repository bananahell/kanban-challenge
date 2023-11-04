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
} from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { GetUser } from '../auth/decorator';
import { CreateChecklistItemDto, EditChecklistItemDto } from './dto';

@Controller('checklist-item')
export class ChecklistItemController {
  constructor(private checklistItemService: ChecklistItemService) {}

  @Get('checklist/:id')
  getChecklistItemsByChecklist(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
  ) {
    this.checklistItemService.getChecklistItemsByChecklist(userId, checklistId);
  }

  @Get('card/:id')
  getChecklistItemsByCard(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    this.checklistItemService.getChecklistItemsByCard(userId, cardId);
  }

  @Get(':id')
  getChecklistItemsById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
  ) {
    this.checklistItemService.getChecklistItemsById(userId, checklistItemId);
  }

  @Post()
  createChecklistItem(@GetUser('id') userId: number, @Body() dto: CreateChecklistItemDto) {
    return this.checklistItemService.createChecklistItem(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChecklistItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
  ) {
    return this.checklistItemService.deleteChecklistItemById(userId, checklistItemId);
  }

  @Patch(':id')
  editChecklistItemById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistItemId: number,
    @Body() dto: EditChecklistItemDto,
  ) {
    return this.checklistItemService.editChecklistItemById(userId, checklistItemId, dto);
  }
}
