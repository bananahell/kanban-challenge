import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { ErrorMessages } from '../error-msgs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Gets data from controller to save into database. Uses argon2 to make a password hash.
   * @param dto Data from controller.
   * @returns The newly created user without the password hash.
   */
  async signUp(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passHash: hash,
        },
      });
      return await this.signToken(user.id, user.email);
    } catch (error) {
      // P2002 is the error code for "unique field already exists", in this case the email
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException(ErrorMessages.AuthCredentialsTaken);
      }
      throw error;
    }
  }

  /**
   * Checks user data from controller to get JWT token for sign in.
   * @param dto Data from controller.
   * @returns A JWT token for the user to use in the bearer authorization header field.
   */
  async signIn(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(ErrorMessages.AuthEmailNotFound);
    }
    const passwordsMatch = await argon2.verify(user.passHash, dto.password);
    if (!passwordsMatch) {
      throw new ForbiddenException(ErrorMessages.AuthIncorrectPassword);
    }
    return await this.signToken(user.id, user.email);
  }

  /**
   * Generates a JWT access token to be used by the user in the bearer authorization header field.
   * @param userId Session user id.
   * @param email User's email used to generate access token.
   * @returns A 30 minute JWT access token.
   */
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
