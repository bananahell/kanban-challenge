import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object used for a user's authorization into the database.
 * @param email User's email.
 * @param password User's password.
 * @param name User's name.
 */
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
