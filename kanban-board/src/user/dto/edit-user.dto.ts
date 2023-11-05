import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object used for editing users.
 * @param email User's email.
 * @param name User's name.
 */
export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
