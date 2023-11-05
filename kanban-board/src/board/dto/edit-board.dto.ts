import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing boards.
 * @param title Board's title.
 * @param background String with information of the board's background.
 * @param ownerId Board owner's user id.
 */
export class EditBoardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsNumber()
  @IsOptional()
  ownerId?: number;
}
