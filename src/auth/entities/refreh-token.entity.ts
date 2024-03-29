import { HashRT } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

export class RefreshTokenEntity implements HashRT {
  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }

  @IsUUID('4')
  id: string;

  @IsUUID('4')
  userId: string;
  user: UserEntity;

  @IsString()
  hashRt: string;
}
