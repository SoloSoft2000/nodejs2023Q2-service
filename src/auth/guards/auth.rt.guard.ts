import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const hashRt = await this.authService.findUserByRefreshToken(refreshToken);
    if (!hashRt) {
      throw new ForbiddenException('RefreshToken not valid');
    }
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch {
      throw new ForbiddenException('Refresh token has expired');
    }
    return true;
  }
}
