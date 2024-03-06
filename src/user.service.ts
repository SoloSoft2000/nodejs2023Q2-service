import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UserEntity,
} from './interfaces/user.interface';
import { randomUUID } from 'crypto';
import { UpdateStatus } from './interfaces/comon.interfaces';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];

  getUsers(): UserEntity[] {
    return this.users;
  }

  getUserById(userId: string): UserEntity {
    return this.users.find((user) => user.id === userId);
  }

  create(user: CreateUserDto): UserEntity {
    const dateNow = Date.now();
    const newUser = new UserEntity({
      id: randomUUID(),
      version: 0,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...user,
    });
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(userId: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    return initialLength !== this.users.length;
  }

  updateById(userId: string, userData: UpdateUserDto): UpdateStatus {
    const idx = this.users.findIndex((user) => user.id === userId);
    if (idx === -1) {
      return { success: false, error: 'UserNotFound' };
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
