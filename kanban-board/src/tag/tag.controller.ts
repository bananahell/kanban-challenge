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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tags')
@UseGuards(JwtGuard)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getTags() {
    return await this.tagService.getTags();
  }

  @Get(':id')
  async getTagById(@Param('id', ParseIntPipe) tagId: number) {
    return await this.tagService.getTagById(tagId);
  }

  @Post()
  async createTag(@Body() dto: CreateTagDto) {
    return await this.tagService.createTag(dto);
  }

  @Delete(':id')
  async deleteTagById(@Param('id', ParseIntPipe) tagId: number) {
    return await this.tagService.deleteTagById(tagId);
  }

  @Patch(':id')
  async editTagById(@Param('id', ParseIntPipe) tagId: number, @Body() dto: EditTagDto) {
    return await this.tagService.editTagById(tagId, dto);
  }
}
