import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for creating boards.
 * @param title Board's title.
 * @param background Path to the board's background file, or a hex value of the background's color.
 */
export class CreateBoardDto {
  @ApiProperty({
    description: "Board's title.",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Path to the board's background file, or a hex value of the background's color.",
  })
  @IsString()
  @IsOptional()
  background?: string;
}
