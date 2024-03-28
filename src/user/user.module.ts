import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [UserService, ConfigService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
