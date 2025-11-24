# Part 14. Guard

## Guard란?

Guard는 권한등 조건을 확인한 후 요청이 라우트 핸들러로 전달될지 말지를 결정한다  
이 과정을 우린 흔히 인가 (Authorization)이라고 부르며 요청을 보낸 사용자가 요청을 수행할 자격이 있는지 확인하게 된다

Middleware에서도 Guard와 같은 기능을 수행할 수 있지만 Middleware는 실행 문맥이 부족하다  
어느 한 Middleware가 실행된 다음에 어떤 기능이 실행될지 알 수가 없다  
반면에 Guard는 ExecutionContext 객체에 어떤 기능이 다음으로 실행될지 정확히 알 수 있다

## Guard 적용법1

- UseGuard 데코레이터를 사용해서 사용할 Guard를 지정할 수 있다
- 엔드포인트에 사용하고 싶으면 메서드 위에, 클래스 전체에 사용하고 싶으면 클래스 위에 적용하면 된다

## Guard 적용법2

- Global하게 적용할 수 있는 방법은 두가지가 존재한다
- useGlobalGuards를 사용하는 방법이 제일 간단하다
- 디펜던시 인젝션이 필요하다면 AppModule의 provides에 제공할 수도 있다