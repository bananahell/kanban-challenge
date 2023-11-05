import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, EditTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}

  async getTags() {
    return await this.prismaService.tag.findMany();
  }

  async getTagById(tagId: number) {
    return await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  async createTag(dto: CreateTagDto) {
    return await this.prismaService.tag.create({
      data: {
        ...dto,
      },
    });
  }

  async deleteTagById(tagId: number) {
    return await this.prismaService.tag.delete({
      where: {
        id: tagId,
      },
    });
  }

  async editTagById(tagId: number, dto: EditTagDto) {
    return await this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        ...dto,
      },
    });
  }
}
