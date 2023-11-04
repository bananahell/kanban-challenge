import { Module } from '@nestjs/common';
import { StatusListController } from './status-list.controller';
import { StatusListService } from './status-list.service';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation.service';

@Module({
  controllers: [StatusListController],
  providers: [StatusListService, PrismaService, ValidationService],
})
export class StatusListModule {}
