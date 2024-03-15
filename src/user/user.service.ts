import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async findOne(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async remove(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser ? true : false;
  }

  async update(userId: string, userData: UpdateUserDto) {
    const userForUpdate = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userForUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userData.oldPassword !== userForUpdate.password) {
      throw new HttpException('Old password not valid', HttpStatus.FORBIDDEN);
    }

    userForUpdate.password = userData.newPassword;
    userForUpdate.version++;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: userForUpdate,
    });
  }
}
