import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Movie } from './movie/entity/movie.entity';
import { MovieDetail } from './movie/entity/movie-detail.entity';
import { DirectorModule } from './director/director.module';
import { Director } from './director/entity/director.entity';
import { GenreModule } from './genre/genre.module';
import { Genre } from './genre/entity/genre.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigModule이 인스턴스화 되면서 환경변수를 사용할 수 있도록 설정
      isGlobal: true, // 모든 모듈에서 환경변수를 사용할 수 있도록 설정
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      // 모듈이 설정된 정보를 기반으로 비동기적으로 설정을 할 수 있도록 해줌
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Movie, MovieDetail, Director, Genre],
        synchronize: true, // 개발 환경에서만 사용
      }),
      inject: [ConfigService],
    }),
    MovieModule,
    DirectorModule,
    GenreModule,
  ],
})
export class AppModule {}
