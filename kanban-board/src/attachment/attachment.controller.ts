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
import { AttachmentService } from './attachment.service';
import { GetUser } from '../auth/decorator';
import { CreateAttachmentDto, EditAttachmentDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('attachments')
@UseGuards(JwtGuard)
@Controller('attachments')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @ApiBearerAuth()
  @Get('card/:id')
  getAttachmentsByCard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return this.attachmentService.getAttachmentsByCard(userId, cardId);
  }

  @ApiBearerAuth()
  @Get(':id')
  getAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
  ) {
    return this.attachmentService.getAttachmentById(userId, attachmentId);
  }

  @ApiBearerAuth()
  @Post()
  createAttachment(@GetUser('id') userId: number, @Body() dto: CreateAttachmentDto) {
    return this.attachmentService.createAttachment(userId, dto);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
  ) {
    return await this.attachmentService.deleteAttachmentById(userId, attachmentId);
  }

  @ApiBearerAuth()
  @Patch(':id')
  async editAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
    @Body() dto: EditAttachmentDto,
  ) {
    return await this.attachmentService.editAttachmentById(userId, attachmentId, dto);
  }
}
