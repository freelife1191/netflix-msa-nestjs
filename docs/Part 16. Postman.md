# Part 16. Postman

---

## Postman

- Environment
  - Globals
    - Variable(변수명), Type(타입), Current value(값) 설정
    - 필요한 곳에서 `{{변수명}}` 으로 사용

### Scripts

- Pre-request: 요청을 보내기전에 수행
- Post-response: 응답을 받은뒤에 수행

```js
pm.test("Status code is 201", function() {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  pm.environment.set("accessToken", body.accessToken);
  pm.environment.set("refreshToken", body.refreshToken);
})
```
 
- Authorization
  - 자식들은 모두 `Inherit auth from parent` 로 설정 
  - 부모 그룹에 Bearer Auth 토큰 `{{accessToken}}` 하면 모두 자동 설정됨

---

## Postman Database Seeding

- `{{$ramdomFullName}}`: 랜덤한 이름
- `{{$randomCountry}}`: 랜덤한 국가
- `{{$randomNoun}}`: 랜덤한 명사
- `{{$randomLoremSentence}}`: 랜덤한 문장

### Create movie

- title
  - `{{$ramdomNoun}} {{$randomAdjective}} {{$randomAlphaNumeric}}`
- detail
  - `{{$randomLoremSentence}}`
- directorId
  - `{{director}}`
- genreIds
  - `{{genres}}`

### Post-response Scripts

`directorIds` 생성

```js
pm.test("Status code is 201", function() {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  let directors = pm.environment.get("directorIds");
  // '' -> 7
  // 7 -> 7,8
  if (!directors) {
    directors=body.id;
  } else {
    directors = directors + ',' + body.id;
  }
  pm.environment.set("directorIds", directors);
})
```

`genreIds` 생성

```js
pm.test("Status code is 201", function() {
  pm.response.to.have.status(201);
  const body = pm.response.json();
  let genres = pm.environment.get("genreIds");
  // '' -> 7
  // 7 -> 7,8
  if (!genres) {
    genres=body.id;
  } else {
    genres = genres + ',' + body.id;
  }
  pm.environment.set("genreIds", genres);
})
```

### Pre-request Scripts

- `director`, `genres` 생성

```js
const _ = require('lodash');
const directorIds = pm.environment.get("directorIds").split(",");
const randomDirectorId = _.sample(directorIds);
pm.environment.set("director", randomDirectorId);

const directorIds = pm.environment.get("genreIds").split(",");
const pickedGenreIds = [];
let failCount = 0;
while(pickedGenreIds.length < 3 && failCount < 20){
  const randomGenreId = _.sample(genreIds); 
  if(pickedGenreIds.includes(randomGenreId)){
    failCount++;
    continue;
  }
  pickedGenreIds.push(randomGenreId);
}

pm.environment.set("genres", pickedGenreIds);
```

## Runner

- 자동으로 실행할 항목을 선택하고 원하는 만큼 실행할 수 있음