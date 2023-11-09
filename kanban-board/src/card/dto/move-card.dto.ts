import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data transfer object used for creating cards.
 * @param statusListId Id of card's new status list.
 */ export class MoveCardDto {
  @ApiProperty({
    description: "Id of card's new status list.",
  })
  @IsNumber()
  @IsNotEmpty()
  statusListId: number;
}
