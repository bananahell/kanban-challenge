import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TagService } from './tag.service';
import { CreateTagDto, EditTagDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  getTags() {
    this.tagService.getTags();
  }

  @Get(':id')
  getTagById(@Param('id', ParseIntPipe) tagId: number) {
    return this.tagService.getTagById(tagId);
  }

  @Post()
  createTag(@Body() dto: CreateTagDto) {
    this.tagService.createTag(dto);
  }

  @Delete(':id')
  deleteTagById(@Param('id', ParseIntPipe) tagId: number) {
    this.tagService.deleteTagById(tagId);
  }

  @Patch(':id')
  editTagById(@Param('id', ParseIntPipe) tagId: number, @Body() dto: EditTagDto) {
    this.tagService.editTagById(tagId, dto);
  }
}
