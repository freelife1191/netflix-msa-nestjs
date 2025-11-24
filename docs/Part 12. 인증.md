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

## 회원가입 및 비밀번호 암호화

- 원본 비밀번호는 그 어디에도 저장하지 않는다. 서버가 해킹되더라도 비밀번호를 알 수 없게하기 위함이다
- 원본 비밀번호대신 암호화된 값을 데이터베이스에 저장한다
- 비밀번호는 절대 복호화가 안되고 같은 값에대해 항상 같은 결과를 반환하는 알고리즘을 사용해서 암호화한다
- 비밀번호를 비교할때는 입력된 비밀번호를 다시 암호화하고 암호화된 값이 같은지 비교한다
- bcrypt가 가장 많이 사용되는 비밀번호 알고리즘이다

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

## JWT란?

- 무상태 (Stateless) 인증에 사용된다
- 인터넷으로 전송할만큼 작으며 인증에 필요한 모든 정보가 자체적으로 담겨있다
- Header, Payload, Signature 세개의 구간으로 이루어져있다
- 표준화된 클레임이 존재한다. (iss, exp, sub, aud등)
- 인증 (Authentication), 인가 (Authorization)에 효율적이다

jwt 모듈 설치

```bash
$ pnpm i @nestjs/jwt passport-jwt
$ pnpm i -D @types/passport-jwt
```

## Passport란?

- 모듈화된 인증 시스템 : 다양한 전략 (Strategy)를 쉽게 연결해서 사용 가능하다. 인증관련 작성할 코드가 많이 줄어든다
- 미들웨어 기반 디자인 : 요청, 응답 라이프사이클에 비파괴적 방식으로 통합된다
- 일반화된 가벼운 코어 : 패스포트 코어는 넓은 전략을 수용 할 수 있도록 가볍고 일반적으로 (Unopinonated) 설계됐다
- 세션 및 토큰 방식 사용 : 세션 기반과 토큰 기반의 인증 시스템 모두 사용 가능하다
- 방대한 생태계 : 다양한 오픈소스 전략들이 무료로 공개돼있다. 어려운 부분은 직접 코딩할 필요 없을 가능성이 높다

passport 모듈 설치

https://www.passportjs.org/

```bash
$ pnpm i @nestjs/passport passport passport-local
$ pnpm i @types/passport-local
```