import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { loadYaml } from './load-yaml';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  const document = loadYaml();
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
