import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditChecklistItemDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
