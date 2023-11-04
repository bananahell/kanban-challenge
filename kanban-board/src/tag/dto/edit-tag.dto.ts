import { IsOptional, IsString } from 'class-validator';

export class EditTagDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @IsString()
  @IsOptional()
  fontColor?: string;
}
