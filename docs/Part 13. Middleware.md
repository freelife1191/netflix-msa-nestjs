# Part 13. Middleware

request -> Middleware -> guard -> interceptor -> pipe -> Controller,service,Repository
request <- Exception Filter <- Interceptor <- Controller,service,Repository

## Middleware 란?

Middleware는 라우트 핸들러가 실행되기 전에 실행된다  
Request와 Response 객체에 접근 할 수 있다

Middleware는 다음과 같은 작업을 할 수 있다

- 자유롭게 코드 실행
- 요청과 응답 객체를 변경
- 요청 응답 사이클 중단
- 다음 미들웨어 실행하기