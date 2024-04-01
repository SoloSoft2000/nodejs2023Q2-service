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
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch {
      throw new HttpException('Already signed up', HttpStatus.CONFLICT);
    }
  }

  @Delete(':uuid')
  @HttpCode(204)
  async deleteUser(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    try {
      await this.userService.remove(uuid);
      return { message: 'User deleted successfully' };
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':uuid')
  async updateUser(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(uuid, updateUserDto);
  }
}
