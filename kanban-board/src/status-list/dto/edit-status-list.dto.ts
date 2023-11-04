import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditStatusListDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  position?: number;
}
