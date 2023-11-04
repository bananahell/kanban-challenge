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

@UseGuards(JwtGuard)
@Controller('attachments')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @Get('card/:id')
  getAttachmentsByCard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return this.attachmentService.getAttachmentsByCard(userId, cardId);
  }

  @Get(':id')
  getAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
  ) {
    return this.attachmentService.getAttachmentById(userId, attachmentId);
  }

  @Post()
  createAttachment(@GetUser('id') userId: number, @Body() dto: CreateAttachmentDto) {
    return this.attachmentService.createAttachment(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
  ) {
    return this.attachmentService.deleteAttachmentById(userId, attachmentId);
  }

  @Patch(':id')
  editAttachmentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) attachmentId: number,
    @Body() dto: EditAttachmentDto,
  ) {
    return this.attachmentService.editAttachmentById(userId, attachmentId, dto);
  }
}
