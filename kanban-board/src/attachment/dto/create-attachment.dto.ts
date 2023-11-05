import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating attachments.
 * @param content Attachment's content.
 * @param cardId Id of card holder of this attachment.
 */
export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
