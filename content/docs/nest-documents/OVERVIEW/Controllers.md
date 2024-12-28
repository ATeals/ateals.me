---
title: Controllers
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-28T17:21:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: controllers
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/controllers)

컨트롤러는 클라이언트의 수신 요청을 처리하고 응답을 반환할 책임이 있습니다.

![](https://i.imgur.com/0KvjPKc.png)

라우팅 메커니즘은 어떤 컨트롤러가 어떤 요청을 수신할지 제어합니다. 각 컨트롤러에는 둘 이상의 경로가 있는 경우가 많으며, 각 경로마다 다른 작업을 수행할 수 있습니다.

Nest에서는 컨트롤러를 클래스와 데코레이터를 이용해 생성합니다. 데코레이터는 클래스를 필수 메타데이터와 연결하고 Nest가 라우팅 맵을 생성할 수 있도록 합니다. (요청을 해당 컨틀롤러에 연결)

## Routing[#](https://docs.nestjs.com/controllers#routing)

```typescript
import { Controller, Get } from "@nestjs/common";

@Controller("cats")
export class CatsController {
  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

- 기본 컨트롤러 정의를 위해 `@Controller()`를 사용합니다.
- `@Controller()`에 경로 접두사 (예시에서 'cats')를 지정하면 파일의 각 경로에서 해당 부분을 반복할 필요가 없습니다. `@Get()`의 경우 경로가 `/cats`

HTTP요청 메서드 데코레이터를 사용하면 Nest가 HTTP 요청에 대한 특정 엔드포인트 핸들러를 생성하도록 지정합니다. 예를 들어 `@Get('breed')`를 결합하면  GET /cats/breed와 같은 요청에 대한 경로 매핑이 생성됩니다.

위 예시에서 GET요청이 이루어지면 Nest는 요청을 사용자 정의 `findAll()`로 라우팅합니다. 여기서 메서드 이름은 완전히 임의적이라는 점에 유의하세요. Nest는 선택한 메서드 이름에 어떤 의미도 부여하지 않습니다.

이 메서드는 200 상태 코드와 관련 응답을 반환하는데, 이 경우에는 문자열일 뿐입니다. 왜 이런 일이 발생할까요? 설명을 위해 먼저 Nest가 응답을 조작하는 데 두 가지 다른 옵션을 사용한다는 개념을 소개하겠습니다

- Standard(권장)
  이 기본 제공 메서드를 사용하면 요청 핸들러가 JS 객체 또는 배열을 반환할 때 자동으로 JSON 직렬화 합니다. 그러나 원시 타입을 반환하는 경우 직렬화를 시도하지 않고 값만 전송합니다. 값만 반환하면 나머지는 Nest가 처리합니다.

  또한 응답의 상태 코드는 201을 사용하는 POST 요청을 제외하고는 기본적으로 항상 200입니다. 핸들러 수준에서 `@HttpCode(...)` 데코레이터를 추가하여 이 동작을 변경할 수 있습니다.

- Library-specific
  라이브러리별(예: Express) 응답 객체를 사용할 수 있으며, 메서드 핸들러 시그니처에 @Res() 데코레이터를 사용하여 삽입할 수 있습니다(예: findAll(@Res() 응답)). 이 접근 방식을 사용하면 해당 객체에 의해 노출된 기본 응답 처리 메서드를 사용할 수 있습니다. 예를 들어 Express에서는 response.status(200).send()와 같은 코드를 사용하여 응답을 구성할 수 있습니다.

## Request object[#](https://docs.nestjs.com/controllers#request-object)

핸들러는 종종 클라이언트 요청 세부 정보에 액세스해야 합니다. Nest는 기본 플랫폼(기본적으로 Express)의 요청 객체에 대한 액세스를 제공합니다. 핸들러의 서명에 @Req() 데코레이터를 추가하여 Nest에 요청 객체를 삽입하도록 지시하면 요청 객체에 액세스할 수 있습니다.

요청객체에는 HTTP 요청을 나타냅니다. 아래는 제공되는 데코레이터와 이들이 나타내는 일반 플랫폼별 객체 목록입니다.

| 데코레이터                | 객체                                |
| ------------------------- | ----------------------------------- |
| `@Request(), @Req()`      | `req`                               |
| `@Response(), @Res()`\*   | `res`                               |
| `@Next()`                 | `next`                              |
| `@Session()`              | `req.session`                       |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |
| `@Ip()`                   | `req.ip`                            |
| `@HostParam()`            | `req.hosts`                         |

## Resources[#](https://docs.nestjs.com/controllers#resources)

Nest는 모든 표준 HTTP 메서드에 대한 데코레이터를 제공합니다. `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, @Head() 또한 `@All()`은 이 모든 메서드를 처리하는 엔드포인트를 정의합니다.

## Route wildcards[#](https://docs.nestjs.com/controllers#route-wildcards)

패턴 기반 경로도 지원됩니다. 예를 들어 별표는 와일드카드로 사용되며 어떤 문자 조합과도 일치합니다.

```typescript
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

> [!Warning] 주의
> 와일드 카드는 Express에서만 지원됩니다.

## Status code[#](https://docs.nestjs.com/controllers#status-code)

앞서 언급했듯이 응답 상태 코드는 201인 POST 요청을 제외하고 기본적으로 항상 200입니다. 핸들러 레벨에서 `@HttpCode(...)`를 사용하면 쉽게 변경할 수 있습니다.

```typescript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

상태코드는 동적으로 변경되는 경우가 많습니다. 이 경우 라이브러리별 응답 객체를 사용하거나 오류가 발생하면 예외를 던질 수 있습니다.

## Headers[#](https://docs.nestjs.com/controllers#headers)

사용자가 응답 헤더를 지정하려면 `@Header()` 또는 라이브러리별 응답 객체를 사용하거나 `res.header()`를 직접 호출하면 됩니다.

```typescript
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

## Redirection[#](https://docs.nestjs.com/controllers#redirection)

응답을 리다이렉션하려면 `@Redirect()` 또는 라이브러리별 응답 객체를 사용하거나 `res.redirect()`를 직접 호출하면 됩니다.

`@Redirect()`는 두 개의 인자, `url`과 `statusCode`를 받지만 둘 다 선택 사항입니다. `statusCode`의 기본값은 생략할 경우 `302(Found)`입니다.

```typescript
@Get()
@Redirect('https://nestjs.com', 301)
```

> [!NOTE] HINT
> 때로는 HTTP 상태 코드나 리디렉션 URL을 동적으로 확인하고 싶을 수 있습니다. 이를 위해서는 `@nestjs/common`의 `HttpRedirectResponse` 인터페이스를 따르는 객체를 반환하면 됩니다.
>
> 반환된 값은 `@Redirect()`에 전달된 모든 인수를 재정의합니다.

```typescript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

## Route parameters[#](https://docs.nestjs.com/controllers#route-parameters)

매개변수가 있는 경로를 정의하려면 경로 경로에 경로 매개변수 토큰을 추가하여 요청 URL의 해당 위치에서 동적 값을 캡처할 수 있습니다.  이러한 방식으로 선언된 경로 매개변수는 메서드 서명에 추가해야 하는 `@Param()`를 사용하여 액세스할 수 있습니다.

```typescript
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}

// or

@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}

```

## Sub-Domain Routing[#](https://docs.nestjs.com/controllers#sub-domain-routing)

`@Controller`는 `host` 옵션을 사용하여 들어오는 요청의 HTTP 호스트가 특정값과 일치하도록 요구할 수 있습니다.

```typescript
@Controller({ host: "admin.example.com" })
export class AdminController {
  @Get()
  index(): string {
    return "Admin page";
  }
}
```

> [!danger] 주의
> Fastify는 중첩 라우터를 지원하지 않으므로 하위 도메인 라우팅을 위해 Express 어댑터를 대신 사용해야 합니다.

`path` 라우팅과 마찬가지로 hosts 옵션은 동적 경로로 사용할 수 있습니다. 이러반 방식으로 선언된 호스트 매개변수는 메서드 시그니처에 추가해야 하는 `@HostParam()`을 사용해 액세스 할 수 있습니다.

```typescript
@Controller({ host: ":account.example.com" })
export class AccountController {
  @Get()
  getInfo(@HostParam("account") account: string) {
    return account;
  }
}
```

## Scopes[#](https://docs.nestjs.com/controllers#scopes)

다른 프로그래밍 언어 경험이 있는 사람에게는 Nest에서 거의 모든 것이 들어오는 요청에서 공유된다는 사실이 의외로 느껴질 수 있습니다. DB에 대한 연결 풀, 전역 상태를 가진 싱글톤 서비스 등이 있습니다. Node는 모든 요청이 별도 스레드에서 처리되는 요청/응답 다중 스레드 무상태 모델을 따르지 않는다는 점을 기억하세요. 따라서 싱글톤 인스턴스를 사용하는 것은 애플리케이션에 완전히 안전합니다.

그러나 GraphQL 애플리케이션의 요청별 캐싱, 요청 추적 또는 멀티테넌시 등 컨트롤러의 요청 기반 수명이 바람직한 동작일 수 있는 엣지 케이스가 있습니다. 여기에서 범위를 제어하는 방법을 알아보세요.

## Asynchronicity[#](https://docs.nestjs.com/controllers#asynchronicity)

Nest는 모던 JS를 좋아하며 데이터 추출이 대부분 비동기라는 것을 알고 있습니다. 그렇기 때문에 Nest는 `async` 함수를 지원하고 잘 작동합니다.

모든 비동기 함수는 프로미스를 반환해야 합니다. 즉, Nest가 자체적으로 해결할 수 있는 지연된 값을 반환할 수 있습니다.

```typescript
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

또한 Nest의 `route handlers`는 `Rxjs`의 `observable streams`를 반환할 수 있습니다.

```typescript
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

## Request payloads[#](https://docs.nestjs.com/controllers#request-payloads)

이전 POST 라우트 핸들러 예제에서는 클라이언트 매개변수를 허용하지 않았습니다. 여기에 `@Body()`를 추가하여 이 문제를 해결해 보겠습니다.

하지만 먼저 (타입스크립트를 사용하는 경우) DTO(데이터 전송 객체) 스키마를 결정해야 합니다. DTO는 데이터가 네트워크를 통해 전송되는 방식을 정의하는 객체입니다. 타입스크립트 인터페이스를 사용하거나 간단한 클래스를 사용하여 DTO 스키마를 결정할 수 있습니다.

흥미롭게도 여기서는 클래스를 사용하는 것이 좋습니다. 그 이유는 무엇일까요? 클래스는 자바스크립트 ES6 표준의 일부이므로 컴파일된 자바스크립트에서 실제 엔티티로 보존됩니다. 반면에 타입스크립트 인터페이스는 트랜스파일링 과정에서 제거되기 때문에 런타임에 Nest에서 참조할 수 없습니다. 이는 파이프와 같은 기능이 런타임에 변수의 메타타입에 액세스할 수 있을 때 추가적인 가능성을 가능하게 하기 때문에 중요합니다.

```typescript
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

> [!NOTE] HINT
> `ValidationPipe`를 사용하면 프로퍼티 필터링이 가능합니다. 이 경우 허용 가능한 속성을 화이트리스트에 추가할 수 있으며, 화이트리스트에 포함되지 않은 속성은 결과 객체에서 자동으로 제거됩니다.

## Handling errors[#](https://docs.nestjs.com/controllers#handling-errors)

오류처리는 별도로 다루도록 하겠습니다. [여기](https://docs.nestjs.com/exception-filters)

## Library-specific approach[#](https://docs.nestjs.com/controllers#library-specific-approach)

응답을 조작하는 두 번째 방법은 라이브러리별 응답 객체를 사용하는 것입니다. 특정 응답 객체를 삽입하려면 `@Res()` 데코레이터를 사용해야 합니다.

```typescript
  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
```

이 접근 방식이 효과가 있고 실제로 응답 객체에 대한 완전한 제어(헤더 조작, 라이브러리별 기능 등)를 제공함으로써 어떤 면에서는 더 많은 유연성을 허용하지만, 신중하게 사용해야 합니다. 일반적으로 이 접근 방식은 훨씬 덜 명확하며 몇 가지 단점이 있습니다. 가장 큰 단점은 코드가 플랫폼에 따라 달라지고(기본 라이브러리가 응답 객체에 대해 다른 API를 사용할 수 있으므로) 테스트하기가 더 어려워진다는 것입니다(응답 객체를 모방해야 하는 등).

또한 위 예제에서는 인터셉터 및 `@HttpCode() / @Header(`) 데코레이터와 같이 Nest 표준 응답 처리에 의존하는 Nest 기능과의 호환성이 떨어집니다. 이 문제를 해결하려면 다음과 같이 패스스루 옵션을 true로 설정하면 됩니다
