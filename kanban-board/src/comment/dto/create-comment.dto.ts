import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating comments.
 * @param message Comment's message.
 * @param cardId Card containing this comment.
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
