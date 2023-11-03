import { Module } from '@nestjs/common';
import { StatusListController } from './status-list.controller';
import { StatusListService } from './status-list.service';

@Module({
  controllers: [StatusListController],
  providers: [StatusListService],
})
export class StatusListModule {}
