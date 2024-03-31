import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Payload, Tokens } from './types/auth.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenEntity } from './entities/refreh-token.entity';

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
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (this.userService.checkPassword(user, password)) {
      const payload: Payload = { userId: user.id, login: user.login };
      return await this.getTokens(payload);
    }
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

  async refresh(body: { refreshToken: string }): Promise<Tokens> {
    const hashRt = await this.findUserByRefreshToken(body.refreshToken);
    return this.getTokens({ userId: hashRt.user.id, login: hashRt.user.login });
  }

  async findUserByRefreshToken(token: string): Promise<RefreshTokenEntity> {
    return await this.prisma.hashRT.findFirst({
      where: {
        hashRt: token,
      },
      include: {
        user: true,
      },
    });
  }
}
