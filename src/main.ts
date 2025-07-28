import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './modules/filters/http-exception.filter';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeederService } from './modules/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(auth(auth0Config));

  const seederService = app.get(SeederService);
  try {
    await seederService.seedDatabase();
  } catch (error) {
    console.error('Error during database seeding:', error);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(new LoggerMiddleware().use);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for the E-commerce application')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Orders')
    .addTag('Categories')
    .addTag('Products')
    .addTag('Files')
    .addTag('App')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
