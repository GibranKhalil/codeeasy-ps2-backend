import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());

  app.enableCors({
    origin: ['http://localhost:3000', 'https://ps2devhub.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  app.useLogger(logger);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  logger.log(`🚀 API rodando em http://localhost:${port}`);
}
void bootstrap();
