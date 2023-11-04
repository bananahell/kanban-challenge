import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { ValidationService } from '../validation.service';
import { StatusListService } from '../status-list/status-list.service';

@Module({
  providers: [BoardService, StatusListService, ValidationService],
  controllers: [BoardController],
})
export class BoardModule {}
