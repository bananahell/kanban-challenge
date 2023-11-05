import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing comments.
 * @param message Comment's message.
 */
export class EditCommentDto {
  @IsString()
  @IsOptional()
  message?: string;
}
