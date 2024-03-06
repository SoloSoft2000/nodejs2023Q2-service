import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  findOne(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  create(user: CreateUserDto): User {
    const dateNow = Date.now();
    const newUser = new User({
      id: randomUUID(),
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...user,
    });
    this.users.push(newUser);
    return newUser;
  }

  remove(userId: string) {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    return initialLength !== this.users.length;
  }

  update(userId: string, userData: UpdateUserDto) {
    const idx = this.users.findIndex((user) => user.id === userId);
    if (idx === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const user = this.users[idx];

    if (userData.oldPassword !== user.password) {
      throw new HttpException('Old password not valid', HttpStatus.FORBIDDEN);
    }

    user.password = userData.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    this.users[idx] = user;

    return this.users[idx];
  }
}
