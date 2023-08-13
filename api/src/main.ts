import validationOptions from '@/common/validate/validation.options';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(
    configService.getOrThrow<string>('app.apiPrefix', { infer: true }),
  );
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: [/^(.*)/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const PORT = configService.getOrThrow<number>('app.apiPort', { infer: true });
  const HOST = configService.getOrThrow<string>('app.apiHost', { infer: true });
  const MODE = configService.getOrThrow<string>('app.nodeEnv', { infer: true });

  await app.listen(PORT, HOST, async () => {
    const appUrl = await app.getUrl();
    logger.log(`🚀 Server NestApi running. Application on url: ${appUrl}`);
    logger.log(`✨ ${HOST}:${PORT} | mode: ${MODE} | pid: ${process.pid}`);
  });
}
bootstrap();
