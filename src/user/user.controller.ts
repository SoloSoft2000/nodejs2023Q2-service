import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterceptor } from './user.interceptor';

@UseInterceptors(new UserInterceptor())
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    const user = await this.userService.findOne(uuid);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async deleteUser(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    const isFound = await this.userService.remove(uuid);
    if (isFound) {
      return { message: 'User deleted successfully' };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(uuid, updateUserDto);
  }
}
