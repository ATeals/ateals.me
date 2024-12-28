---
title: Execution context
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-08-13T13:36
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: execution-context
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/execution-context)

Nest는 여러 애플리케이션 컨텍스트(예: Nest HTTP 서버 기반, 마이크로서비스 및 웹소켓 애플리케이션 컨텍스트)에서 작동하는 애플리케이션을 쉽게 작성할 수 있도록 도와주는 여러 유틸리티 클래스를 제공합니다. 이러한 유틸리티는 현재 실행 컨텍스트에 대한 정보를 제공하여 광범위한 컨트롤러, 메서드 및 실행 컨텍스트에서 작동할 수 있는 일반 [guards](https://docs.nestjs.com/guards), [filters](https://docs.nestjs.com/exception-filters) 및 [interceptors](https://docs.nestjs.com/interceptors)를 구축하는 데 사용할 수 있습니다.

이 장에서는 이러한 클래스 두 가지를 다룹니다: `ArgumentsHost`와 `ExecutionContext`입니다.

## ArgumentsHost class[#](https://docs.nestjs.com/fundamentals/execution-context#argumentshost-class)

`ArgumentsHost` 클래스는 핸들러에 전달되는 인수를 검색하는 메서드를 제공합니다. 이 클래스를 사용하면 인수를 검색할 적절한 컨텍스트(예: HTTP, RPC(마이크로서비스) 또는 WebSockets)를 선택할 수 있습니다. 프레임워크는 일반적으로 `host` 매개변수로 참조되는 `ArgumentsHost`의 인스턴스를 사용자가 액세스하려는 위치에 제공합니다. 예를 들어  [exception filter](https://docs.nestjs.com/exception-filters#arguments-host)의 `catch()` 메서드는 `ArgumentsHost` 인스턴스와 함께 호출됩니다.

`ArgumentsHost`는 단순히 핸들러의 인수를 추상화하는 역할을 합니다. 예를 들어, HTTP 서버 애플리케이션(`@nestjs/platform-express`가 사용되는 경우)의 경우 `host` 객체는 Express의 `[request, response, next]` 배열을 캡슐화하며, 여기서 `request`는 요청 객체, `response`는 응답 객체, next는 애플리케이션의 요청-응답 사이클을 제어하는 함수입니다. 반면 [GraphQL](https://docs.nestjs.com/graphql/quick-start) 애플리케이션의 경우 `host` 객체에는 `[root, args, context, info]` 배열이 포함됩니다.

## Current application context[#](https://docs.nestjs.com/fundamentals/execution-context#current-application-context)

여러 애플리케이션 컨텍스트에서 실행되는  [guards](https://docs.nestjs.com/guards), [filters](https://docs.nestjs.com/exception-filters)및 [interceptors](https://docs.nestjs.com/interceptors)를 구축할 때는 메서드가 현재 실행 중인 애플리케이션 유형을 확인할 수 있는 방법이 필요합니다. 이 작업은 `ArgumentsHost`의 `getType()` 메서드를 사용하여 수행합니다:

```typescript
if (host.getType() === "http") {
  // 일반 HTTP 요청(REST)의 컨텍스트에서만 중요한 작업을 수행합니다.
} else if (host.getType() === "rpc") {
  // 마이크로서비스 요청의 컨텍스트에서만 중요한 작업을 수행합니다.
} else if (host.getType<GqlContextType>() === "graphql") {
  // 그래프QL 요청의 컨텍스트에서만 중요한 작업을 수행합니다.
}
```

사용 가능한 애플리케이션 유형을 사용하면 아래와 같이 보다 일반적인 컴포넌트를 작성할 수 있습니다.

## Host handler arguments[#](https://docs.nestjs.com/fundamentals/execution-context#host-handler-arguments)

핸들러에 전달되는 인수의 배열을 검색하려면 호스트 객체의 `getArgs()` 메서드를 사용하는 것이 한 가지 방법입니다.

```typescript
const [req, res, next] = host.getArgs();
```

색인별로 특정 인수를 추출하려면 `getArgByIndex()` 메서드를 사용하면 됩니다:

```typescript
const request = host.getArgByIndex(0);
const response = host.getArgByIndex(1);
```

이 예제에서는 인덱스로 요청 및 응답 객체를 검색했는데, 이는 애플리케이션을 특정 실행 컨텍스트에 연결하기 때문에 일반적으로 권장되지 않습니다. 대신 `host` 객체의 유틸리티 메서드 중 하나를 사용하여 애플리케이션에 적합한 애플리케이션 컨텍스트로 전환함으로써 코드를 보다 강력하고 재사용 가능하게 만들 수 있습니다. 컨텍스트 전환 유틸리티 메서드는 다음과 같습니다.

```typescript
/**
 * 컨텍스트를 RPC로 전환합니다.
 */
switchToRpc(): RpcArgumentsHost;
/**
 * 컨텍스트를 HTTP로 전환합니다.
 */
switchToHttp(): HttpArgumentsHost;
/**
 * 컨텍스트를 WebSockets로 전환합니다.
 */
switchToWs(): WsArgumentsHost;
```

`switchToHttp()` 메서드를 사용하여 이전 예제를 다시 작성해 보겠습니다. `host.switchToHttp()` 헬퍼 호출은 HTTP 애플리케이션 컨텍스트에 적합한 `HttpArgumentsHost` 객체를 반환합니다. `HttpArgumentsHost` 객체에는 원하는 객체를 추출하는 데 사용할 수 있는 두 가지 유용한 메서드가 있습니다. 또한 이 경우 Express 유형 어설션을 사용하여 기본 Express 유형 객체를 반환합니다:

```typescript
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

마찬가지로 `WsArgumentsHost`와 `RpcArgumentsHost`에는 마이크로서비스 및 웹소켓 컨텍스트에서 적절한 객체를 반환하는 메서드가 있습니다. 다음은 `WsArgumentsHost`의 메서드입니다:

```typescript
export interface WsArgumentsHost {
  /**
   * Returns the data object.
   */
  getData<T>(): T;
  /**
   * Returns the client object.
   */
  getClient<T>(): T;
}
```

다음은 `RpcArgumentsHost` 의 메서드입니다:

```typescript
export interface RpcArgumentsHost {
  /**
   * Returns the data object.
   */
  getData<T>(): T;

  /**
   * Returns the context object.
   */
  getContext<T>(): T;
}
```

## ExecutionContext class[#](https://docs.nestjs.com/fundamentals/execution-context#executioncontext-class)

`ExecutionContext`는 현재 실행 프로세스에 대한 추가 세부 정보를 제공하는 `ArgumentsHost`를 확장합니다. `ArgumentsHost`와 마찬가지로 Nest는  [guard](https://docs.nestjs.com/guards#execution-context)의 `canActivate()` 메서드와  [interceptor](https://docs.nestjs.com/interceptors#execution-context)의 `intercept()` 메서드와 같이 필요할 수 있는 곳에 `ExecutionContext`의 인스턴스를 제공합니다. 다음과 같은 메서드를 제공합니다:

```typescript
export interface ExecutionContext extends ArgumentsHost {
  /**
   * 현재 핸들러가 속한 컨트롤러 클래스의 유형을 반환합니다.
   */
  getClass<T>(): Type<T>;
  /**
   * 요청 파이프라인에서 다음에 호출될 핸들러(메서드)에 대한 참조를 반환합니다.
   */
  getHandler(): Function;
}
```

`getHandler()` 메서드는 호출하려는 핸들러에 대한 참조를 반환합니다. `getClass()` 메서드는 이 특정 핸들러가 속한 `Controller` 클래스의 유형을 반환합니다. 예를 들어 HTTP 컨텍스트에서 현재 처리된 요청이 `CatsController`의 `create()` 메서드에 바인딩된 `POST` 요청인 경우 `getHandler()`는 `create()` 메서드에 대한 참조를 반환하고 `getClass()`는 인스턴스가 아닌 `CatsController` **클래스**를 반환합니다.

```typescript
const methodKey = ctx.getHandler().name; // "create"
const className = ctx.getClass().name; // "CatsController"
```

현재 클래스와 핸들러 메서드 모두에 대한 참조에 액세스할 수 있는 기능은 뛰어난 유연성을 제공합니다. 가장 중요한 것은 가드 또는 인터셉터 내에서 `Reflector#createDecorator`를 통해 생성된 데코레이터 또는 내장된 `@SetMetadata()` 데코레이터를 통해 메타데이터 세트에 액세스할 수 있다는 점입니다. 이 사용 사례는 아래에서 다룹니다.

## Reflection and metadata[#](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)

Nest는 `Reflector#createDecorator` 메서드를 통해 생성된 데코레이터와 내장된 `@SetMetadata()` 데코레이터를 통해 라우트 핸들러에 **custom metadata**를 첨부할 수 있는 기능을 제공합니다. 이 섹션에서는 두 가지 접근 방식을 비교하고 가드 또는 인터셉터 내에서 메타데이터에 액세스하는 방법을 살펴보겠습니다.

`Reflector#createDecorator`를 사용하여 강력한 타입의 데코레이터를 만들려면 타입 인수를 지정해야 합니다. 예를 들어 문자열 배열을 인수로 받는 `Roles` 데코레이터를 만들어 보겠습니다.

```ts title="roles.decorator.ts
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();
```

여기서 `Roles` 데코레이터는 `string[]` 타입의 단일 인수를 받는 함수입니다. 이제 이 데코레이터를 사용하려면 핸들러에 주석을 달기만 하면 됩니다:

```typescript title="cats.controller.ts"

@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

여기에서는 `admin` 역할이 있는 사용자만 이 경로에 액세스할 수 있도록 하기 위해 `create()` 메서드에 `Roles` 데코레이터 메타데이터를 첨부했습니다.

경로의 역할(사용자 정의 메타데이터)에 액세스하려면 `Reflector` 헬퍼 클래스를 다시 사용하겠습니다. `Reflector` 일반적인 방법으로 클래스에 삽입할 수 있습니다:

```typescript title="roles.guard.ts"
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}
}
```

이제 핸들러 메타데이터를 읽으려면 `get()` 메서드를 사용합니다:

```typescript
const roles = this.reflector.get(Roles, context.getHandler());
```

`Reflector#get` 메서드를 사용하면 데코레이터 참조와 메타데이터를 검색할 **컨텍스트**(데코레이터 대상)의 두 가지 인수를 전달하여 메타데이터에 쉽게 액세스할 수 있습니다. 이 예에서 지정된 **데코레이터**는 `Roles`입니다(위의 `roles.decorator.ts` 파일을 다시 참조하세요). 컨텍스트는 `context.getHandler()`를 호출하여 제공되며, 그 결과 현재 처리된 라우트 핸들러의 메타데이터가 추출됩니다. `getHandler()`는 라우트 핸들러 함수에 대한 **참조**를 제공한다는 점을 기억하세요.

또는 컨트롤러 수준에서 메타데이터를 적용하여 컨트롤러 클래스의 모든 경로에 적용하여 컨트롤러를 구성할 수도 있습니다.

```typescript title="cats.controller.ts"
@Roles(["admin"])
@Controller("cats")
export class CatsController {}
```

이 경우 컨트롤러 메타데이터를 추출하기 위해 `context.getHandler()` 대신 `context.getClass()`를 두 번째 인수(메타데이터 추출을 위한 컨텍스트로 컨트롤러 클래스를 제공하기 위해)로 전달합니다:

```typescript title="roles.guard.ts"
const roles = this.reflector.get(Roles, context.getClass());
```

여러 수준에서 메타데이터를 제공하는 기능을 고려할 때 여러 컨텍스트에서 메타데이터를 추출하고 병합해야 할 수도 있습니다. `Reflector` 클래스는 이를 지원하는 데 사용되는 두 가지 유틸리티 메서드를 제공합니다. 이 메서드는 컨트롤러와 메서드 메타데이터를 한 번에 추출하고 서로 다른 방식으로 결합합니다.

두 수준 모두에서 `Roles` 메타데이터를 제공한 다음 시나리오를 생각해 보세요.

```typescript title="cats.controller.ts"
@Roles(["user"])
@Controller("cats")
export class CatsController {
  @Post()
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
```

`'user'`를 기본 역할로 지정하고 특정 메서드에 대해 선택적으로 재정의하려는 경우, `getAllAndOverride()` 메서드를 사용할 수 있습니다.

```typescript
const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
```

위의 메타데이터를 사용하여 `create()` 메서드의 컨텍스트에서 실행되는 이 코드가 포함된 가드는 `['admin']`을 포함하는 역할을 생성합니다.

둘 다에 대한 메타데이터를 가져와 병합하려면(이 메서드는 배열과 객체를 모두 병합합니다) `getAllAndMerge()` 메서드를 사용합니다:

```typescript
const roles = this.reflector.getAllAndMerge(Roles, [context.getHandler(), context.getClass()]);
```

이렇게 하면 `['user', 'admin']`을 포함하는 `roles`가 됩니다.

이 두 병합 메서드 모두에서 메타데이터 키를 첫 번째 인수로 전달하고 메타데이터 대상 컨텍스트 배열(즉, `getHandler()` 및/또는 `getClass()` 메서드에 대한 호출)을 두 번째 인수로 전달합니다.

## Low-level approach[#](https://docs.nestjs.com/fundamentals/execution-context#low-level-approach)

앞서 언급했듯이 `Reflector#createDecorator`를 사용하는 대신 내장된 `@SetMetadata()` 데코레이터를 사용하여 핸들러에 메타데이터를 첨부할 수도 있습니다.

```typescript title="cats.controller.ts"
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

위의 구성에서 `roles` 메타데이터(`roles`는 메타데이터 키이고 `['admin']`은 연관된 값)를 `create()` 메서드에 첨부했습니다. 이렇게 해도 작동하지만 `@SetMetadata()`를 경로에 직접 사용하는 것은 좋지 않습니다. 대신 아래와 같이 자체 데코레이터를 만들 수 있습니다:

```typescript title="roles.decorator.ts"
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

이 접근 방식은 훨씬 더 깔끔하고 가독성이 높으며 `Reflector#createDecorator` 접근 방식과 어느 정도 유사합니다. 차이점은 `@SetMetadata`를 사용하면 메타데이터 키와 값을 더 많이 제어할 수 있고 둘 이상의 인수를 받는 데코레이터를 만들 수도 있다는 것입니다.

이제 사용자 정의 `@Roles()` 데코레이터가 있으므로 이를 사용하여 `create()` 메서드를 데코레이션할 수 있습니다.

```typescript title="cats.controller.ts"
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

경로의 역할(사용자 지정 메타데이터)에 액세스하려면 `Reflector` 헬퍼 클래스를 다시 사용하겠습니다:

```typescript title="roles.guard.ts"
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}
}
```

이제 핸들러 메타데이터를 읽으려면 get() 메서드를 사용합니다.

```typescript
const roles = this.reflector.get<string[]>("roles", context.getHandler());
```

여기서는 데코레이터 참조를 전달하는 대신 메타데이터 키를 첫 번째 인수로 전달합니다(이 경우 `'roles'`). 다른 모든 것은 `Reflector#createDecorator` 예시와 동일하게 유지됩니다.
