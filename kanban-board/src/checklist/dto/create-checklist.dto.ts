import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
