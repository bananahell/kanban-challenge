import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, EditTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Gets all tags in the database.
   * @returns All tags in the database.
   */
  async getTags() {
    return await this.prismaService.tag.findMany();
  }

  /**
   * Gets a tag by its id.
   * @param tagId Tag's id.
   * @returns The found tag.
   */
  async getTagById(tagId: number) {
    return await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  /**
   * Creates a tag in the database.
   * @param dto Data from controller.
   * @returns The newly created tag.
   */
  async createTag(dto: CreateTagDto) {
    return await this.prismaService.tag.create({
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a tag by its id.
   * @param tagId Tag's id.
   * @returns Nothing.
   */
  async deleteTagById(tagId: number) {
    return await this.prismaService.tag.delete({
      where: {
        id: tagId,
      },
    });
  }

  /**
   * Edit's a tag by its id.
   * @param tagId Tag's id.
   * @param dto Data from controller.
   * @returns The just edited tag.
   */
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
