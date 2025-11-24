# Part 12. 인증

---

### Ch 2. 회원가입

auth 모듈 생성

```bash
$ nest g resource
✔ What name would you like to use for this resource (plural, e.g., "users")? auth
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? No
CREATE src/auth/auth.controller.spec.ts (556 bytes)
CREATE src/auth/auth.controller.ts (204 bytes)
CREATE src/auth/auth.module.ts (241 bytes)
CREATE src/auth/auth.service.spec.ts (446 bytes)
CREATE src/auth/auth.service.ts (88 bytes)
UPDATE src/app.module.ts (2040 bytes)
```

user 모듈 생성

```bash
$ nest g resource
✔ What name would you like to use for this resource (plural, e.g., "users")? user
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/user/user.controller.spec.ts (556 bytes)
CREATE src/user/user.controller.ts (883 bytes)
CREATE src/user/user.module.ts (241 bytes)
CREATE src/user/user.service.spec.ts (446 bytes)
CREATE src/user/user.service.ts (607 bytes)
CREATE src/user/dto/create-user.dto.ts (30 bytes)
CREATE src/user/dto/update-user.dto.ts (169 bytes)
CREATE src/user/entity/user.entity.ts (21 bytes)
UPDATE src/app.module.ts (2105 bytes)
```

bcrypt 설치

```bash
# bcrypt 패키지 설치
$ pnpm i bcrypt
# 타입스크립트 bcrypt 설치
$ pnpm i -D @types/bcrypt
```

https://www.base64decode.org/

test@gamil.com:123123

- Base64 인코딩
  - dGVzdEBnYW1pbC5jb206MTIzMTIz

Header authorization 으로 Basic dGVzdEBnYW1pbC5jb206MTIzMTIz 요청에 대한 응답

```
{
    "createdAt": "2025-10-14T03:19:21.744Z",
    "updatedAt": "2025-10-14T03:19:21.744Z",
    "version": 1,
    "id": 1,
    "email": "test@gamil.com",
    "password": "$2b$10$nADJndHyyX4RMG64pjbLWOMIqOgTZWZ9bSjgbeLTNFZu9FNY.GIay",
    "role": 2
}
```

jwt 모듈 설치

```bash
$ pnpm i @nestjs/jwt passport-jwt
$ pnpm i -D @types/passport-jwt
```

passport 모듈 설치

https://www.passportjs.org/

```bash
$ pnpm i @nestjs/passport passport passport-local
$ pnpm i @types/passport-local
```