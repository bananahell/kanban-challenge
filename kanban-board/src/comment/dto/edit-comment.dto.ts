import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing comments.
 * @param message Comment's message.
 */
export class EditCommentDto {
  @ApiProperty({
    description: "Comment's message.",
  })
  @IsString()
  @IsOptional()
  message?: string;
}
