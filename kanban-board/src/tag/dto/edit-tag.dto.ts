import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing tags.
 * @param name Tag's name.
 * @param backgroundColor Tag's background color.
 * @param fontColor Tag's font color.
 */
export class EditTagDto {
  @ApiProperty({
    description: "Tag's name.",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Tag's background color.",
  })
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiProperty({
    description: "Tag's font color.",
  })
  @IsString()
  @IsOptional()
  fontColor?: string;
}
