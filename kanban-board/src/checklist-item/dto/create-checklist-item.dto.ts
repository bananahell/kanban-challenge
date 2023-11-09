import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object used for creating checklist items.
 * @param description Checklist item's description.
 * @param checklistId Id of checklist containing this checklist item.
 */
export class CreateChecklistItemDto {
  @ApiProperty({
    description: "Checklist item's description.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Id of checklist containing this checklist item.',
  })
  @IsNumber()
  @IsNotEmpty()
  checklistId: number;
}
