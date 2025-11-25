# Part 19. Exception Filter

---

- Controller,Service,Repository -> Interceptor -> Exception Filter -> Response
- Exception Filters
  - Route
  - Controller
  - Global

## Exception Filter란?

NestJS에서는 자체적으로 예외 레이어를 관리한다  
서버에서 발생한 예외가 따로 핸들링 되지 않으면 NestJS 예외 레이어에서 에러를 사용자 친화적으로 변환해서 응답 할 수 있다