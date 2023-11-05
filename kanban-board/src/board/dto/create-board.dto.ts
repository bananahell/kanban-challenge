import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for creating boards.
 * @param title Board's title.
 * @param background String with information of the board's background.
 */
export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  background?: string;
}
