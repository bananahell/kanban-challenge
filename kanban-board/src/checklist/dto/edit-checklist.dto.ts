import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing checklists.
 * @param title Checklist's title.
 */
export class EditChecklistDto {
  @ApiProperty({
    description: "Checklist's title.",
  })
  @IsString()
  @IsOptional()
  title: string;
}
