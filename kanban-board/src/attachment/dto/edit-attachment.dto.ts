import { IsOptional, IsString } from 'class-validator';

export class EditAttachmentDto {
  @IsString()
  @IsOptional()
  content?: string;
}
