import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { LoggingModule } from './logger/logging.module';
import { LoggingMiddleware } from './logger/logging.middleware';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { AppFilter } from './filter/app.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ArtistModule,
    UserModule,
    TrackModule,
    AlbumModule,
    FavsModule,
    PrismaModule,
    AuthModule,
    JwtModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingModule,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AppFilter },
  ],
  exports: [LoggingModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
