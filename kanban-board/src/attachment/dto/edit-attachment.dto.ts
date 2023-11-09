import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing attachments.
 * @param content Path to the attachment's content file.
 */
export class EditAttachmentDto {
  @ApiProperty({
    description: "Path to the attachment's content file.",
  })
  @IsString()
  @IsOptional()
  content?: string;
}
