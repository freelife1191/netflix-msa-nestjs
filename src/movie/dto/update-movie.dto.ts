import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {}, // 첫 번째 인자는 숫자 타입의 고유의 옵션
    { each: true } // 배열의 모든 요소가 숫자인지 검사
  )
  @IsOptional()
  genreIds?: number[];

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  directorId?: number;
}
