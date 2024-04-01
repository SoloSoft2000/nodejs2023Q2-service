import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { loadYaml } from './load-yaml';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/logging.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const logLevel = +process.env.LOG_LEVEL || 4;
  const logLevels: LogLevel[] = ['log', 'verbose', 'warn', 'error', 'fatal'];
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const logService = app.get(LoggingService);
  logService.setLogLevels(<LogLevel[]>logLevels.slice(0, logLevel + 1));
  app.useLogger(logService);

  const document = loadYaml();
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
