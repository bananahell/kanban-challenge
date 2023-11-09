import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating attachments.
 * @param content Path to the attachment's content file.
 * @param cardId Id of card containing this attachment.
 */
export class CreateAttachmentDto {
  @ApiProperty({
    description: "Path to the attachment's content file.",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Id of card containing this attachment.',
  })
  @IsNumber()
  @IsNotEmpty()
  cardId: number;
}
