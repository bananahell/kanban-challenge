import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { ValidationService } from '../validation.service';

@Module({
  controllers: [CardController],
  providers: [CardService, ValidationService],
})
export class CardModule {}
