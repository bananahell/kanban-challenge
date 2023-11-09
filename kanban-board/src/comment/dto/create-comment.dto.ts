import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating comments.
 * @param message Comment's message.
 * @param cardId Id of card containing this comment.
 */
export class CreateCommentDto {
  @ApiProperty({
    description: "Comment's message.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Id of card containing this comment.',
  })
  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
