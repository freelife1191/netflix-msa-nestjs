import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  // UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';
import { Public } from '../auth/decorator/public.decorator';
// import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/user/entity/user.entity';
import { GetMoviesDto } from './dto/get-movies.dto';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // 응답 데이터를 변환하는 인터셉터
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  getMovies(@Query() dto: GetMoviesDto) {
    /// title 쿼리의 타입이 string 타입인지?
    return this.movieService.findAll(dto);
  }

  @Get(':id')
  @Public()
  getMovie(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory(error) {
          throw new BadRequestException('숫자를 입력해주세요!');
        },
      })
    )
    id: string
  ) {
    return this.movieService.findOne(+id);
  }

  @Post()
  @RBAC(Role.admin)
  // @UseGuards(AuthGuard)
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.create(body);
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(@Param('id', ParseIntPipe) id: string, @Body() body: UpdateMovieDto) {
    return this.movieService.update(+id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: string) {
    return this.movieService.deleteMovie(+id);
  }
}
