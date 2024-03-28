import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Payload, Tokens } from './types/auth.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signIn(signInDto: CreateUserDto): Promise<Tokens> {
    const { login, password } = signInDto;
    const user = await this.userService.findOne(login);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload: Payload = { userId: user.id, login: user.login };
    return await this.getTokens(payload);
  }

  private async getTokens(payload: Payload): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    await this.prisma.hashRT.upsert({
      where: {
        userId: payload.userId,
      },
      update: {
        hashRt: refreshToken,
      },
      create: {
        userId: payload.userId,
        hashRt: refreshToken,
      },
    });

    return { accessToken, refreshToken };
  }
}
