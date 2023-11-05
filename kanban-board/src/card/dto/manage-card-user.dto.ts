import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data transfer object used for adding or removing users from a card's users array.
 * @param cardId Card's id.
 * @param userId User's id.
 */
export class ManageCardUserDto {
  @IsNumber()
  @IsNotEmpty()
  cardId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
