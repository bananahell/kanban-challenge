import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing checklist items.
 * @param description Checklist item's description.
 * @param isDone Boolean status of this checklist item being done or not.
 */
export class EditChecklistItemDto {
  @ApiProperty({
    description: "Checklist item's description.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Boolean status of this checklist item being done or not.',
  })
  @IsBoolean()
  @IsOptional()
  isDone?: boolean;
}
