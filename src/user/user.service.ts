import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async remove(userId: string) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
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

    const newVersion = userForUpdate.version + 1;
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: userData.newPassword,
        version: newVersion,
      },
    });
  }
}
