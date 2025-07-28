import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // @Type(() => Number) でDTOの文字列を数値に変換できるようになる
      transform: true,
      transformOptions: {
        // @Type(() => Number) を書かなくても、DTOの型定義に基づいて暗黙的に変換してくれる
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('Blog app API')
    .setDescription('Use The base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'http://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  // Instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // enable cors
  // ReactのURLからリクエストしていいよ（http://localhost:3500）
  app.enableCors({
    origin: 'http://localhost:3500',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
