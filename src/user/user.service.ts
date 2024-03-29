import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(userIdorLogin: string): Promise<UserEntity> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ id: userIdorLogin }, { login: userIdorLogin }],
      },
    });
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const { password, ...userData } = user;
    const cryptSalt = this.configService.get<number>('CRYPT_SALT');
    const hashedPassword = await bcrypt.hash(password, +cryptSalt);
    return await this.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
  }

  async checkPassword(user: UserEntity, password: string) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new HttpException('Password not valid', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  async remove(userId: string): Promise<UserEntity> {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async update(userId: string, userData: UpdateUserDto): Promise<UserEntity> {
    const userForUpdate = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userForUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.checkPassword(
      userForUpdate,
      userData.oldPassword,
    );

    if (isPasswordValid) {
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
}
