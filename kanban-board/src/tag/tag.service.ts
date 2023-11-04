import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, EditTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}

  getTags() {
    return this.prismaService.tag.findMany();
  }

  getTagById(tagId: number) {
    return this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  async createTag(dto: CreateTagDto) {
    return this.prismaService.tag.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteTagById(tagId: number) {
    return this.prismaService.tag.delete({
      where: {
        id: tagId,
      },
    });
  }

  async editTagById(tagId: number, dto: EditTagDto) {
    return this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        ...dto,
      },
    });
  }
}
