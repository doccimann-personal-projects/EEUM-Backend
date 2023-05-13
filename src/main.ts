import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { winstonLogger } from './common/logging/set-winston.logger';
import * as apm from 'elastic-apm-node';

dotenv.config();

async function bootstrap() {
  const applicationEnvironment = process.env.NODE_ENV;

  const APPLICATION_NAME: string = process.env.APPLICATION_NAME;
  const APPLICATION_DESCRIPTION: string = process.env.APPLICATION_DESCRIPTION;
  const APPLICATION_VERSION: string = process.env.APPLICATION_VERSION;
  const PORT = process.env.PORT;

  const ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL;
  const ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SERVER_SECRET_TOKEN;

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

  // Elastic APM
  apm.start({
    serviceName: APPLICATION_NAME,
    serverUrl: ELASTIC_APM_SERVER_URL,
    secretToken: ELASTIC_APM_SECRET_TOKEN,
    transactionSampleRate: applicationEnvironment === 'production' ? 0.5 : 1,
    ignoreUrls: ['/'],
  });

  await app.listen(PORT);
}
bootstrap();
