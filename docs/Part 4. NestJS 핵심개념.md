# Part 4. NestJS 핵심개념

---

https://codefactory.notion.site/NestJS-1dcb4f618d24460b84021c6fff59473b

## Ch 2. 컨트롤러

```bash
nest new netflix
```

prettier 설치

```bash
pnpm install -D prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-tailwindcss
```

## Ch 4. 모듈

```bash
$ nest g resource

✔ What name would you like to use for this resource (plural, e.g., "users")? movie
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/movie/movie.controller.spec.ts (566 bytes)
CREATE src/movie/movie.controller.ts (904 bytes)
CREATE src/movie/movie.module.ts (248 bytes)
CREATE src/movie/movie.service.spec.ts (453 bytes)
CREATE src/movie/movie.service.ts (621 bytes)
CREATE src/movie/dto/create-movie.dto.ts (31 bytes)
CREATE src/movie/dto/update-movie.dto.ts (173 bytes)
CREATE src/movie/entities/movie.entity.ts (22 bytes)
UPDATE package.json (2066 bytes)
UPDATE src/app.module.ts (361 bytes)
⠋ Installing packages (pnpm)...(node:79784) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)
✔ Packages installed successfully.
```
