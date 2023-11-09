import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for creating cards.
 * @param title Card's title.
 * @param description Card's description.
 * @param beginDate Card's task execution beginning date.
 * @param endDate Card's task execution end date.
 * @param statusListId Id of status list containing this card.
 * @param tagId Id of tag assigned to this card.
 */
export class CreateCardDto {
  @ApiProperty({
    description: "Card's title.",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Card's description.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Card's task execution beginning date.",
  })
  @IsDateString()
  @IsOptional()
  beginDate?: Date;

  @ApiProperty({
    description: "Card's task execution end date.",
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Id of status list containing this card.',
  })
  @IsNumber()
  @IsNotEmpty()
  statusListId: number;

  @ApiProperty({
    description: 'Id of tag assigned to this card.',
  })
  @IsNumber()
  @IsOptional()
  tagId?: number;
}
