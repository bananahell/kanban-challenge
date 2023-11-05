import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing cards.
 * @param title Card's title.
 * @param description Card's description.
 * @param beginDate Card's task execution beginning date.
 * @param endDate Card's task execution end date.
 * @param statusListId Status list containing this card.
 * @param tagId Tag assigned to card.
 */
export class EditCardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  beginDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsOptional()
  statusListId?: number;

  @IsNumber()
  @IsOptional()
  tagId?: number;
}
