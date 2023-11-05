import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing attachments.
 * @param content Attachment's content.
 */
export class EditAttachmentDto {
  @IsString()
  @IsOptional()
  content?: string;
}
