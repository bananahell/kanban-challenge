import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing status lists.
 * @param name Status list's name.
 * @param position Status list's position in the board.
 */
export class EditStatusListDto {
  @ApiProperty({
    description: "Status list's name.",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Status list's position in the board.",
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}
