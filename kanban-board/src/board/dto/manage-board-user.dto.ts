import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data transfer object used for adding or removing users from a board's user array.
 * @param boardId Board's id.
 * @param userId User's id.
 */
export class ManageBoardUserDto {
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
