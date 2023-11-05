import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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
