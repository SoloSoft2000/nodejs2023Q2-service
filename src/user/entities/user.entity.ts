import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsDate, IsInt, IsString, IsUUID } from 'class-validator';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @IsUUID('4')
  id: string;

  @IsString()
  login: string;

  @IsInt()
  version: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @Exclude()
  password: string;
}
