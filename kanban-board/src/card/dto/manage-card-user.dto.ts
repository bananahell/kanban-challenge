import { IsNotEmpty, IsNumber } from 'class-validator';

export class ManageCardUserDto {
  @IsNumber()
  @IsNotEmpty()
  cardId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
