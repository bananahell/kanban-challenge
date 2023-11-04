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
import { ChecklistService } from './checklist.service';
import { GetUser } from '../auth/decorator';
import { CreateChecklistDto, EditChecklistDto } from './dto';

@UseGuards(JwtGuard)
@Controller('checklists')
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}

  @Get('card/:id')
  getChecklistsByCard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return this.checklistService.getChecklistsByCard(userId, cardId);
  }

  @Get(':id')
  getChecklistById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) checklistId: number) {
    return this.checklistService.getChecklistById(userId, checklistId);
  }

  @Post()
  createChecklist(@GetUser('id') userId: number, @Body() dto: CreateChecklistDto) {
    return this.checklistService.createChecklist(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChecklistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
  ) {
    return this.checklistService.deleteChecklistById(userId, checklistId);
  }

  @Patch(':id')
  editChecklistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
    @Body() dto: EditChecklistDto,
  ) {
    return this.checklistService.editChecklistById(userId, checklistId, dto);
  }
}
