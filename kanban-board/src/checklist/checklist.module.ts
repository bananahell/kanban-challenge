import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { ValidationService } from '../validation.service';

@Module({
  providers: [ChecklistService, ValidationService],
  controllers: [ChecklistController],
})
export class ChecklistModule {}
