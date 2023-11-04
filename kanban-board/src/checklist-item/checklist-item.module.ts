import { Module } from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistItemController } from './checklist-item.controller';
import { ValidationService } from '../validation.service';

@Module({
  providers: [ChecklistItemService, ValidationService],
  controllers: [ChecklistItemController],
})
export class ChecklistItemModule {}
