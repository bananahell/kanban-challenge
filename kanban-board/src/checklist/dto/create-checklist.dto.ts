import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating checklists.
 * @param title Checklist's title.
 * @param cardId Card containing this checklist.
 */
export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
