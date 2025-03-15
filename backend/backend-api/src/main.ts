import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure CORS if needed
  app.enableCors();

  // Configure OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for managing users in the system')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('api', app, document);

  // Setup Scalar API Reference UI
  app.use(
    '/docs',
    apiReference({
      title: 'User Management API',
      description: 'API for managing users in the system',
      logo: 'https://scalar.com/assets/images/scalar-logo.svg',
      theme: 'default',
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api`);
  console.log(`Scalar API Reference available at: ${await app.getUrl()}/docs`);
}
bootstrap()
  .then()
  .catch((e) => console.error(e));
