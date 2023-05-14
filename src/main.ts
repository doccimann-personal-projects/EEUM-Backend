import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { winstonLogger } from './common/logging/set-winston.logger';

dotenv.config();

async function bootstrap() {
  const APPLICATION_NAME: string = process.env.APPLICATION_NAME;
  const APPLICATION_DESCRIPTION: string = process.env.APPLICATION_DESCRIPTION;
  const APPLICATION_VERSION: string = process.env.APPLICATION_VERSION;
  const PORT = process.env.PORT;

  const logger = winstonLogger;

  const app = await NestFactory.create(AppModule);

  // Logging
  app.useLogger(logger);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Interceptor
  app.useGlobalInterceptors(new SuccessInterceptor());

  // pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // security for swagger
  app.use(
    ['/backend-docs', 'docs-json'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  // documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(APPLICATION_NAME)
    .setDescription(APPLICATION_DESCRIPTION)
    .setVersion(APPLICATION_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'accesskey',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('backend-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
