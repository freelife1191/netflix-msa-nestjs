import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 정의하지 않은 속성은 제거
      forbidNonWhitelisted: true, // 정의하지 않은 속성이 있으면 에러 발생
      // transformOptions: { // 요청 데이터를 클래스 인스턴스로 변환
      //   enableImplicitConversion: true, // 문자열을 숫자로 변환
      // }
    })
  ); // Class Validator를 사용하기 위해 추가
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
