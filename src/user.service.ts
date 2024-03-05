import { Injectable } from '@nestjs/common';
import { CreateUserDto, User } from './interfaces/user.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(userId: string): User {
    return this.users.find((user) => user.id === userId);
  }

  create(user: CreateUserDto): User {
    const dateNow = Date.now();
    const newUser: User = {
      id: randomUUID(),
      version: 0,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }
}
