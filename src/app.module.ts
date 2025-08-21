import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService], // 인스턴스화 해서 컨트롤러에 주입
})
export class AppModule {}
