import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/helpers';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { RefreshTokenPipe } from './pipes/refresh-token.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch {
      throw new HttpException('Already signed up', HttpStatus.CONFLICT);
    }
  }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(RefreshTokenPipe)
  async refresh(@Body() refreshToken) {
    return this.authService.refresh(refreshToken);
  }
}
