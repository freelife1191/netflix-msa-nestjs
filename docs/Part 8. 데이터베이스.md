# Part 8. 데이터베이스

---

## Ch 2. TypeORM 기본기

### 02. Database 정의하고 환경변수 사용해보기

기존 환경변수

```js
TypeOrmModule.forRoot({
    type: process.env.DB_TYPE as "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [],
    synchronize: true, // 개발 환경에서만 사용
    }),
```

패키지 설치

```bash
pnpm i @nestjs/config joi @nestjs/typeorm typeorm pg
```

### 10. Entity Embedding & Entity Inheritance 실습

```js
import { Exclude, Expose, Transform } from "class-transformer";
import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column(
      () => BaseEntity,
  )
  base: BaseEntity;
}
```

### 11. Single Table Inheritance 실습

`entity/movie.entity.ts`

```js
import { Exclude, Expose, Transform } from "class-transformer";
import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}

/// moive / series -> Content
/// runtime (영화 상영시간) / seriesCount (몇개 부작인지)
@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;
}

@ChildEntity()
export class Movie extends BaseEntity {
  @Column()
  runtime: number;
}

@ChildEntity()
export class Series extends Content {
  @Column()
  seriesCount: number;
}
```

`app.module.ts`

```js
entities: [Movie, Content, Series],
```

`movie.module.ts`

```js
TypeOrmModule.forFeature([Movie, Series]),
```

`movie.controller.ts`

```js
@Post()
postMovie(@Body() body: CreateMovieDto) {
  return this.movieService.createMovie(body);
}

@Post()
postSeries(@Body() body: CreateMovieDto) {
  return this.movieService.createSeries(body);
}
```

`movie.service.ts`

```js
constructor(
  @InjectRepository(Series)
  private readonly seriesRepository: Repository<Series>
)

async createMovie(createMovieDto: CreateMovieDto) {
  const movie = this.movieRepository.save({
    ...createMovieDto,
    runtime: 100
  });
  return movie;
}

async createSeries(createSeriesDto: CreateMovieDto) {
  const series = this.seriesRepository.save({
    ...createSeriesDto,
    seriesCount: 16
  });

  return series;
}
```

### 19. Many to One Relationship

director resource 만들기

```bash
$ nest g resource
✔ What name would you like to use for this resource (plural, e.g., "users")? director
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/director/director.controller.spec.ts (596 bytes)
CREATE src/director/director.controller.ts (967 bytes)
CREATE src/director/director.module.ts (269 bytes)
CREATE src/director/director.service.spec.ts (474 bytes)
CREATE src/director/director.service.ts (663 bytes)
CREATE src/director/dto/create-director.dto.ts (34 bytes)
CREATE src/director/dto/update-director.dto.ts (185 bytes)
CREATE src/director/entities/director.entity.ts (25 bytes)
UPDATE src/app.module.ts (2158 bytes)
```

### 23. Unique & Nullable Constraint 작업해보기

```sql
DROP TABLE director CASCADE;
DROP TABLE movie CASCADE;
DROP TABLE movie_detail CASCADE;
```

Director POST

```json
{
  "name": "Christopher Nolan",
  "dob": "1980-07-30T00:00:00.000Z",
  "nationality": "United Kingdom"
}
```

Movie POST

```json
{
  "title": "인셉션",
  "genre": "fantasy",
  "detail": "인셉션은 레오나르도 디카프리오가 나오는 영화다",
  "directorId": 1
}
```

강제로 null 테스트

```sql
UPDATE movie SET "directorID" = null WHERE ID = 1;
```

오류 메세지

```bash
ERROR:  column "directorID" of relation "movie" does not exist
LINE 1: UPDATE movie SET "directorID" = null WHERE ID = 1;
                         ^

SQL 상태: 42703
위치: 18
```

레퍼런스가 null 이 되지 않도록 막을 수 있다

이런걸 무결성이라 한다

```sql
DELETE FROM movie_detail WHERE id = 1;
```

오류 메세지

```bash
ERROR:  update or delete on table "movie_detail" violates foreign key constraint "FK_87276a4fc1647d6db559f61f89a" on table "movie"
Key (id)=(1) is still referenced from table "movie".

SQL 상태: 23503
자세히: Key (id)=(1) is still referenced from table "movie".
```

Unique 설정후 제목 중복 등록 불가

```js
@Column({
  unique: true, // 중복 불가
})
title: string;
```

오류 메세지

```bash
driverError: error: duplicate key value violates unique constraint "UQ_a81090ad0ceb645f30f9399c347"
```

### 24. Genre Many to Many Relationship 생성하고 엔드포인트 작업하기

genre resource 만들기

```bash
$ nest g resource
✔ What name would you like to use for this resource (plural, e.g., "users")? genre
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/genre/genre.controller.spec.ts (566 bytes)
CREATE src/genre/genre.controller.ts (904 bytes)
CREATE src/genre/genre.module.ts (248 bytes)
CREATE src/genre/genre.service.spec.ts (453 bytes)
CREATE src/genre/genre.service.ts (621 bytes)
CREATE src/genre/dto/create-genre.dto.ts (31 bytes)
CREATE src/genre/dto/update-genre.dto.ts (173 bytes)
CREATE src/genre/entities/genre.entity.ts (22 bytes)
UPDATE src/app.module.ts (1915 bytes)
```

### 25. POST movie 엔드포인트 업데이트하기

```json
// 감독 생성
{
    "name": "Christopher Nolan",
    "dob": "1980-07-30T00:00:00.000Z",
    "nationality": "United Kingdom"
}

// 액션 장르 생성
{
    "name": "Action"
}

// 판타지 장르 생성
{
    "name": "Fantasy"
}

// 영화 생성
{
    "title": "다크나이트: 라이즈",
    "detail": "크리스토퍼 놀란의 대작 중 하나",
    "directorId": 1,
    "genreIds": [1, 2]
}
```

### 26. PATCH GET movie 엔드포인트 업데이트하기

영화 업데이트 수정 후

```json
// 장르 추가
{
  "name": "Science Fiction"
}
```

영화 업데이트

```json
// 추가된 장르로 업데이트
{
  "genreIds": [3]
}
```
