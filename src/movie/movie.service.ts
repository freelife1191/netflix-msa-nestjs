import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Injectable()
export class MovieService {
  private movies: Movie[] = [];
  private idCounter = 3;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async findAll(title?: string) {
    /// 나중에 title 필터 기능 추가하기
    if (!title) {
      return [
        await this.movieRepository.find({
          relations: ['detail', 'director', 'genres'], // 감독 정보도 함께 조회
        }),
        await this.movieRepository.count(),
      ];
    }
    return await this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['detail', 'director', 'genres'], // 감독 정보도 함께 조회
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
    }

    const genres = await this.genreRepository.find({
      where: { id: In(createMovieDto.genreIds) }, // In은 배열의 모든 요소가 존재하는지 검사
    });

    if (genres.length !== createMovieDto.genreIds.length) {
      throw new NotFoundException(
        `존재하지 않는 장르가 있습니다! 존재하는 ids -> ${genres.map(genre => genre.id).join(',')}`
      );
    }

    const movie = this.movieRepository.save({
      title: createMovieDto.title,
      detail: {
        detail: createMovieDto.detail,
      },
      director,
      genres,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다!');
    }

    const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

    let newDirector;
    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });
      if (!director) {
        throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
      }
      newDirector = director;
    }

    let newGenres;
    if (genreIds) {
      const genres = await this.genreRepository.find({
        where: { id: In(genreIds) },
      });

      if (genres.length !== genreIds.length) {
        throw new NotFoundException(
          `존재하지 않는 장르가 있습니다! 존재하는 ids -> ${genres.map(genre => genre.id).join(',')}`
        );
      }
      newGenres = genres;
    }

    /**
     * {
     *  ...movieRest,
     *  {director: director}
     * }
     *waaaa
     * {
     *  ...movieRest,
     *  director: director
     * }
     */
    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };

    await this.movieRepository.update({ id }, movieUpdateFields);

    if (detail) {
      await this.movieDetailRepository.update(
        { id: movie.detail.id },
        { detail }
      );
    }

    const newMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });

    if (!newMovie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다!');
    }

    if (newGenres) {
      newMovie.genres = newGenres;
    }

    await this.movieRepository.save(newMovie);

    // return this.movieRepository.preload(newMovie); // preload는 존재하는 엔티티를 반환하고 존재하지 않는 엔티티를 반환하지 않음
    return this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id);

    return id;
  }
}
