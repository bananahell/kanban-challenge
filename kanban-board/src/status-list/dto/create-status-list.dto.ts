import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating status lists.
 * @param name Status list's name.
 * @param position Status list's position in the board.
 * @param boardId Id of board containing this status list.
 */
export class CreateStatusListDto {
  @ApiProperty({
    description: "Status list's name.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Status list's position in the board.",
  })
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @ApiProperty({
    description: 'Id of board containing this status list.',
  })
  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
