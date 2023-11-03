import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUserDto {
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
