import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() dto: AuthDto) {
    return await this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() dto: AuthDto) {
    return await this.authService.signIn(dto);
  }
}
