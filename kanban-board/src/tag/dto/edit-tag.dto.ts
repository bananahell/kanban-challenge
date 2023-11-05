import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing tags.
 * @param name Tag's name.
 * @param backgroundColor Tag's background color.
 * @param fontColor Tag's font color.
 */
export class EditTagDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @IsString()
  @IsOptional()
  fontColor?: string;
}
