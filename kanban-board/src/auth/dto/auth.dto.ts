import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object used for a user's authorization into the database.
 * @param email User's email.
 * @param password User's password.
 * @param name User's name.
 */
export class AuthDto {
  @ApiProperty({
    description: "User's email.",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User's password.",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "User's name.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
