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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('checklists')
@UseGuards(JwtGuard)
@Controller('checklists')
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}

  @Get('card/:id')
  async getChecklistsByCard(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    return await this.checklistService.getChecklistsByCard(userId, cardId);
  }

  @Get(':id')
  async getChecklistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
  ) {
    return await this.checklistService.getChecklistById(userId, checklistId);
  }

  @Post()
  async createChecklist(@GetUser('id') userId: number, @Body() dto: CreateChecklistDto) {
    return await this.checklistService.createChecklist(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteChecklistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
  ) {
    return await this.checklistService.deleteChecklistById(userId, checklistId);
  }

  @Patch(':id')
  async editChecklistById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) checklistId: number,
    @Body() dto: EditChecklistDto,
  ) {
    return await this.checklistService.editChecklistById(userId, checklistId, dto);
  }
}
