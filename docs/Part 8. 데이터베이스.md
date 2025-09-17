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

---

## Ch 3. QueryBuilder

### 1. SELECT

```ts
const movie = await dataSource
  .createQueryBuilder()
  .select('movie')
  .from(Movie, 'movie')
  .leftJoinAndSelect('movie.detail', 'detail')
  .leftJoinAndSelect('movie.director', 'director')
  .leftJoinAndSelect('movie.genres', 'genres')
  .where('movie.id = :id', { id: 1 })
  .getOne();
```

### 2. INSERT

```ts
await dataSource
  .createQueryBuilder()
  .insert()
  .into(Movie)
  .values([
    {
      title: 'New Movie',
      genre: 'Action',
      director: director,
      genres: genres,
    },
  ])
  .execute();
```

### 3. UPDATE

```ts
await dataSource
  .createQueryBuilder()
  .update(Movie)
  .set({ title: 'Updated Title', genre: 'Drama' })
  .where('id = :id', { id: 1 })
  .execute();
```

### 4. DELETE

```ts
await dataSource
  .createQueryBuilder()
  .delete()
  .from(Movie)
  .where('id = :id', { id: 1 })
  .execute();
```

### 5. RELATIONS

```ts
const genres = await dataSource
  .createQueryBuilder()
  .relation(Movie, 'genres')
  .of(1) // Movie id
  .loadMany();
```

### `getOne()`, `getMany()`, `select()`

```ts
// 단일 Row만 가져올때
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .select(['user.id', 'user.firstName', 'user.lastName'])
  .getOne();

// 복수 Row 가져올때
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .select(['user.id', 'user.firstName', 'user.lastName'])
  .getMany();
```

### `where()`

```ts
// 하나의 필터링 조건 적용
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where('user.isActive = :isActive', { isActive: true })
  .getMany();

// 다수의 필터링 조건 적용
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where('user.firstName = :firstName', { firstName: 'John' })
  .andWhere('user.lastName = :lastName', { lastName: 'Doe' })
  .getMany();
```

### `orderBy()`

```ts
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .orderBy('user.lastName', 'ASC')
  .addOrderBy('user.firstName', 'DESC')
  .getMany();
```

### `skip()`, `take()`

```ts
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .skip(10)
  .take(5)
  .getMany();
```

### `join()`

```ts
// Inner Join
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .innerJoinAndSelect('user.profile', 'profile')
  .getMany();

// Left Join
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .getMany();
```

### Aggregation

```ts
const userCount = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .select('COUNT(user.id)', 'count')
  .getRawOne();
```

### Subquery

```ts
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where(qb => {
    const subQuery = qb
      .subQuery()
      .select('subUser.id')
      .from(User, 'subUser')
      .where('subUser.isActive = :isActive', { isActive: true })
      .getQuery();
    return 'user.id IN ' + subQuery;
  })
  .setParameter('isActive', true)
  .getMany();
```

### Raw Query

```ts
const users = await connection
  .getRepository(User)
  .createQueryBuilder()
  .select('user')
  .from(User, 'user')
  .where('user.isActive = :isActive', { isActive: true })
  .getRawMany();
```

### 영화 추가

```json
{
  "title": "인셉션",
  "detail": "레오나르도 디카프리오 나온 영화",
  "directorId": 1,
  "genreIds": [2, 3]
}
```

```json
{
  "title": "다크나이트: 라이즈",
  "detail": "다크나이트 2",
  "directorId": 1,
  "genreIds": [2, 3]
}
```

### 감독 추가

```json
{
  "name": "Quentin Tarantino",
  "dob": "1963-05-27T00:00:00.000Z",
  "nationality": "USA"
}
```

### 영화 수정

```json
{
  "genreIds": [3],
  "directorId": 2
}
```

---

## Ch 4. Transaction

- `Lost Reads`
  - 두 트랜잭션이 같은 데이터를 업데이트해서 하나의 업데이트가 손실되는 경우
- `Dirty Reads`
  - 아직 Commit 되지 않은 값을 다른 트랜잭션이 읽는 경우
- `Non-repeatable Reads`
  - 한 트랜잭션에서 데이터를 두번 읽을때 다른 결과가 나오는 경우
- `Phantom Reads`
  - 첫 Read 이후에 다른 트랜잭션에서 데이터를 추가한 경우

---

## Ch 5. 데이터베이스 마이그레이션

Migration은 데이터베이스 변경사항을 스크립트로 작성해서 반영한다  
통제된 상황에서 데이터베이스 스키마 변경 및 복구를 진행 할 수 있다

### Migration이 필요한 이유: 왜 sync 옵션으론 부족한가?

- `Controlled Changes`
  - 원하는 상황에 원하는 형태로 마이그레이션을 자유롭게 실행 할 수 있다
- `Reversible`
  - 진행한 마이그레이션을 쉽게 되돌릴 수 있다
- `Versioning`
  - 마이그레이션은 스키마 변경에 대한 히스토리를 담고 있다. 디버깅에 매우 유용하다
- `Consistency`
  - 다양한 환경에서 데이터베이스 스키마가 같게 유지되도록 할 수 있다
- `Complex Changes`
  - 복잡한 데이터베이스의 변화를 직접 컨트롤 할 수 있다

### Migration Configuration : ormconfig.json

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration"
  }
}
```

### Migration : 테이블 생성 (RAW SQL)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovieAndDirectorTables1634567890123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "director" (
                "id" SERIAL NOT NULL,
                "name" VARCHAR NOT NULL,
                "dob" DATE,
                "nationality" VARCHAR,
                PRIMARY KEY ("id")
            );
        `);
    await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" SERIAL NOT NULL,
                "title" VARCHAR NOT NULL,
                "genre" VARCHAR,
                "directorId" INTEGER,
                PRIMARY KEY ("id"),
                FOREIGN KEY ("directorId") REFERENCES "director"("id") ON DELETE SET NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "director"`);
  }
}
```

### Migration : 테이블 생성 (Migration API)

```ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMovieAndDirectorTables1634567890123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //... 생략
    await queryRunner.createTable(
      new Table({
        name: 'movie',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'genre',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'directorId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'movie',
      new TableForeignKey({
        columnNames: ['directorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'director',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movie');
    await queryRunner.dropTable('director');
  }
}
```

### Migration : 칼럼 추가 (RAW SQL)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateOfBirthToDirector1634567890124
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            ADD "dateOfBirth" DATE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            DROP COLUMN "dateOfBirth"
        `);
  }
}
```

### Migration : 칼럼 추가 (Migration API)

```ts
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDateOfBirthToDirector1634567890124
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'director',
      new TableColumn({
        name: 'dateOfBirth',
        type: 'date',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('director', 'dateOfBirth');
  }
}
```

### Migration : 칼럼 이름 변경 (Raw SQL)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNameToFullNameInDirector1634567890125
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            RENAME COLUMN "name" TO "fullName"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            RENAME COLUMN "fullName" TO "name"
        `);
  }
}
```

### Migration : 칼럼 이름 변경 (Migration API)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNameToFullNameInDirector1634567890125
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('director', 'name', 'fullName');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('director', 'fullName', 'name');
  }
}
```

### Migration : 칼럼 타입 변경 (RAW SQL)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEmailTypeInDirector1634567890126
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            ALTER COLUMN "email" TYPE TEXT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "director"
            ALTER COLUMN "email" TYPE VARCHAR
        `);
  }
}
```

### Migration : 칼럼 타입 변경 (Migration API)

```ts
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeEmailTypeInDirector1634567890126
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'director',
      'email',
      new TableColumn({
        name: 'email',
        type: 'text',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'director',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      })
    );
  }
}
```

### Migration : Relationship 작업 (RAW SQL)

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGenreAndMovieGenreTables1634567890127
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "genre" (
                "id" SERIAL NOT NULL,
                "name" VARCHAR NOT NULL,
                PRIMARY KEY ("id")
            );
        `);

    await queryRunner.query(`
            CREATE TABLE "movie_genres_genre" (
                "movieId" INTEGER NOT NULL,
                "genreId" INTEGER NOT NULL,
                PRIMARY KEY ("movieId", "genreId"),
                FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE,
                FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movie_genres_genre"`);
    await queryRunner.query(`DROP TABLE "genre"`);
  }
}
```

### Migration : Relationship 작업 (Migration API)

```ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateGenreAndMovieGenreTables1634567890127
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'genre',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true
    );

    //...생략
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movie_genres_genre');
    await queryRunner.dropTable('genre');
  }
}
```

### Migration CLI 커맨드

https://typeorm.io/docs/advanced-topics/migrations/

```bash
# Migration 파일 생성하기
npx typeorm migration:generate -n <MigrationName>

# Migration 실행하기
npx typeorm migration:run

# Migration 되돌리기
npx typeorm migration:revert
```
