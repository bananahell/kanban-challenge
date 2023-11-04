import { IsOptional, IsString } from 'class-validator';

export class EditChecklistDto {
  @IsString()
  @IsOptional()
  title: string;
}
