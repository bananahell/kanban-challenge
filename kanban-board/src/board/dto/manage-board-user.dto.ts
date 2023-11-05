import { IsNotEmpty, IsNumber } from 'class-validator';

export class ManageBoardUserDto {
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
