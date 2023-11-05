import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  /**
   * Deletes all of the database's entries. Used in the e2e testing suite.
   * @returns Nothing.
   */
  async cleanDb() {
    return await this.$transaction([
      this.tag.deleteMany(),
      this.board.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
