import {
  ForbiddenException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenPipe implements PipeTransform {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async transform(value: any) {
    if (value.refreshToken) {
      const hashRt = await this.authService.findUserByRefreshToken(
        value.refreshToken,
      );
      if (!hashRt) {
        throw new ForbiddenException('RefreshToken not valid');
      }
      try {
        this.jwtService.verify(value.refreshToken, {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });
      } catch {
        throw new ForbiddenException('Refresh token has expired');
      }
      return hashRt.user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
