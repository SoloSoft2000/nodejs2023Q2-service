import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { Public } from 'src/helpers';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthRtGuard } from './guards/auth.rt.guard';

@UseGuards()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @Public()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch {
      throw new HttpException('Already signed up', HttpStatus.CONFLICT);
    }
  }

  // @Public()
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @UseGuards(AuthRtGuard)
  async refresh(@Body() refreshToken) {
    return this.authService.refresh(refreshToken);
  }
}
