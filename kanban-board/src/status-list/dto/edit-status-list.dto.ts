import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing status lists.
 * @param name Status list's name.
 * @param position Status list's position in the board.
 */
export class EditStatusListDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  position?: number;
}
