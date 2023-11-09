import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating checklists.
 * @param title Checklist's title.
 * @param cardId Id of card containing this checklist.
 */
export class CreateChecklistDto {
  @ApiProperty({
    description: "Checklist's title.",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Id of card containing this checklist.',
  })
  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
