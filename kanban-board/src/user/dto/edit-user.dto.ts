import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing users.
 * @param email User's email.
 * @param name User's name.
 */
export class EditUserDto {
  @ApiProperty({
    description: "User's email.",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: "User's name.",
  })
  @IsString()
  @IsOptional()
  name?: string;
}
