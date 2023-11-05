import { AuthGuard } from '@nestjs/passport';

/**
 * JWT authorization guard that extends AuthGuard('jwt').
 */
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
