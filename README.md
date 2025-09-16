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
# docker
$ docker compose up --build
```

## Study Documents

- [Class 01](./docs/Class%2001.md)