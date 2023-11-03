import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditBoardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsNumber()
  @IsOptional()
  ownerId?: number;
}
