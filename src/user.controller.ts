import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  IdParamsDto,
  UpdateUserDto,
  User,
} from './interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserById(@Param() params: IdParamsDto): Promise<User> {
    const user = this.userService.getUserById(params.id);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteUser(@Param() params: IdParamsDto): Promise<boolean> {
    const isFound = this.userService.deleteUser(params.id);
    if (isFound) {
      return isFound;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(
    @Param() params: IdParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = this.userService.updateById(params.id, updateUserDto);
    if (!result.success) {
      if (result.error === 'UserNotFound') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else if (result.error === 'InvalidPassword') {
        throw new HttpException('Old password not valid', HttpStatus.FORBIDDEN);
      }
    }
    return { message: 'User updated successfully' };
  }
}
