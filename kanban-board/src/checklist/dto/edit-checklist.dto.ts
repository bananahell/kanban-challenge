import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing checklists.
 * @param title Checklist's title.
 */
export class EditChecklistDto {
  @IsString()
  @IsOptional()
  title: string;
}
