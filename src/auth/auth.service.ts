import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: CreateUserDto): Promise<any> {
    const { login, password } = signInDto;
    const user = await this.userService.findOne(login);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.generateToken(payload, true),
      refreshToken: await this.generateToken(payload, false),
    };
  }

  private async generateToken(
    payload: { sub: string; username: string },
    isAccess: boolean,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        isAccess ? 'JWT_SECRET_KEY' : 'JWT_SECRET_REFRESH_KEY',
      ),
      expiresIn: this.configService.get<string>(
        isAccess ? 'TOKEN_EXPIRE_TIME' : 'TOKEN_REFRESH_EXPIRE_TIME',
      ),
    });
  }
}
