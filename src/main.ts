import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { loadYaml } from './load-yaml';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/logging.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(LoggingService));
  const document = loadYaml();
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
