import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for creating tags.
 * @param name Tag's name.
 * @param backgroundColor Tag's background color.
 * @param fontColor Tag's font color.
 */
export class CreateTagDto {
  @ApiProperty({
    description: "Tag's name.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
