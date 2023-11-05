import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing checklist items.
 * @param description Checklist item's description.
 * @param isDone Boolean status of this checklist item being done or not.
 */
export class EditChecklistItemDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
