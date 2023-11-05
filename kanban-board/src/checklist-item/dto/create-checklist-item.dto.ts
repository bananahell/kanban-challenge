import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating checklist items.
 * @param description Checklist item's description.
 * @param checklistId Checklist containing this checklist item.
 */
export class CreateChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  checklistId: number;
}
