import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { loadYaml } from './load-yaml';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/logging.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const logLevel = +process.env.LOG_LEVEL || 5;
  const logLevels: LogLevel[] = [
    'verbose',
    'debug',
    'warn',
    'log',
    'error',
    'fatal',
  ];
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const logService = app.get(LoggingService);
  logService.setLogLevels(<LogLevel[]>logLevels.slice(0, logLevel + 1));
  app.useLogger(logService);

  process.on('unhandledRejection', () => {
    logService.fatal('unhandledRejection');
  });

  process.on('uncaughtException', () => {
    logService.fatal('uncaughtException');
  });

  const document = loadYaml();
  SwaggerModule.setup('doc', app, document);

  // setTimeout(() => {
  //   throw new Error('Test uncaughtException');
  // }, 5000);

  // setTimeout(() => {
  //   Promise.reject(new Error('Test unhandledRejection'));
  // }, 9000);

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
