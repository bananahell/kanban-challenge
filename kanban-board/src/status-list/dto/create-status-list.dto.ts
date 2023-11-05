import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating status lists.
 * @param name Status list's name.
 * @param position Status list's position in the board.
 * @param boardId Board containing this status list.
 */
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
