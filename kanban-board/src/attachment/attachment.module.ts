import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { ValidationService } from '../validation.service';

@Module({
  providers: [AttachmentService, ValidationService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
