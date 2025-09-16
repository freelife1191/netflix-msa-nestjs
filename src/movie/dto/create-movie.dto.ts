import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { MovieDetail } from '../entity/movie-detail.entity';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsNumber()
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {}, // 첫 번째 인자는 숫자 타입의 고유의 옵션
    { each: true } // 배열의 모든 요소가 숫자인지 검사
  )
  genreIds: number[];
}
