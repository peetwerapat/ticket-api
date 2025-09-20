import { UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          error: Object.values(err.constraints ?? {}).join(', '),
        }));
        return new UnprocessableEntityException(formattedErrors);
      },
    }),
  );

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
      .setTitle('Ticket System API')
      .setDescription('API for Ticket System')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT',
      )
      .build(),
    documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, documentFactory, {
    swaggerOptions: {
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      docExpansion: 'none',
    },
  });

  await app.listen(configService.get<number>('APP_PORT', 80));
}
bootstrap();
