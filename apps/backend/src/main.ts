import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('apiPrefix') ?? 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);

  console.log(`Prova backend running on port ${port} (${apiPrefix})`);
}

bootstrap();