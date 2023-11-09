import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing boards.
 * @param title Board's title.
 * @param background Path to the board's background file, or a hex value of the background's color.
 * @param ownerId User id of the new owner of the board.
 */
export class EditBoardDto {
  @ApiProperty({
    description: "Board's title.",
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Path to the board's background file, or a hex value of the background's color.",
  })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiProperty({
    description: 'User id of the new owner of the board.',
  })
  @IsNumber()
  @IsOptional()
  ownerId?: number;
}
