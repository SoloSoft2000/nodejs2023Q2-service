import { Injectable } from '@nestjs/common';
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
      version: 0,
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
      return { success: false, error: 'IdNotFound' };
    }

    const user = this.users[idx];

    if (userData.oldPassword !== user.password) {
      return { success: false, error: 'InvalidPassword' };
    }

    user.password = userData.newPassword;
    this.users[idx] = user;

    return { success: true };
  }
}
