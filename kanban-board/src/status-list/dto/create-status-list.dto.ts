import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStatusListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
