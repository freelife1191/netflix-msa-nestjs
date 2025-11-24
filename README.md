# Netflix MSA NestJS

코드팩토리의 백엔드 아카데미: 한 번에 끝내는 NestJS 패키지 - 기초부터 MSA까지


## Command

### Project setup

```bash
$ pnpm install
```

### Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Run tests

```bash
# lint
$ pnpm run lint

# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# wath tests
$ pnpm run test:watch

# test coverage
$ pnpm run test:cov

# test debug
$ pnpm run test:debug
```

### Etc

```bash
# prettier format fix
$ pnpm format

# eslint fix
$ pnpm run lint
```

### Docker Compose PostgreSQL

- postgreSQL
  - port: 5423
  - user: postgres
  - password: postgres
  - db: postgres
- pgadmin
  - port: 5550
  - email: example@pgadmin.com
  - password: pgadmin

```bash
# podman
$ podman compose up --build
# dockerㅞ
$ docker compose up --build
```

### podman compose 실행

docker 디렉토리로 이동

```bash
$ cd docker
```

pgadmin 디렉토리 생성 및 권한 변경

```bash
$ mkdir pgadmin
$ chmod 777 pgadmin
```

pgadmin 접속 후 데이터베이스 생성 podman 의 경우 로컬 IP를 입력해야됨

데이터베이스는 Netflix 로 생성 접속 IP는 192.168.50.7 입력

.env 의 DB_HOST 도 localhost 로 안될 경우 192.168.50.7 입력


## Study Documents

- [Class 01](./docs/Class%2001.md)