---
title: Exception filters
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-29T18:22:00
draft: 
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: exception-filters
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/exception-filters)

Nest에는 애플리케이션 전체에서 처리되지 않은 모든 예외를 처리하는 예외 계층이 내장되어 있습니다. 애플리케이션 코드에서 처리되지 않은 예외가 발생하면 이 계층에서 이를 포착하여 적절한 사용자 친화적인 응답을 자동으로 전송합니다.

![](https://i.imgur.com/0ErHIjK.png)

기본적으로 이 작업은 내장된 전역 예외 필터에 의해 수행되며, 이 필터는 HttpException 유형의 예외를 처리합니다. 예외가 인식되지 않는 경우 (HttpException도 아니고 HttpException에서 상속하는 클래스도 아닌 경우) 기본 제공 예외 필터는 다음과 같은 기본 JSON 응답을 생성합니다.

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

> [!NOTE] HINT
> 전역 예외 필터는 부분적으로 http-errors 라이브러리를 지원합니다. 기본적으로 statusCode 및 메시지 속성을 포함하는 모든 예외가 올바르게 채워지고 응답으로 다시 전송됩니다. (인식할 수 없는 예외의 경우 기본값인 InternalServerErrorException 대신).

## Throwing standard exceptions[#](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions)

`Nest`는 `@nestjs/common` 패키지에서 기본적인 `HttpException` 클래스를 제공합니다. 일반적인 `HTTP REST/GraphQL API` 기반 애플리케이션의 경우 특정 오류 조건이 발생할 때 표준 `HTTP` 응답 객체를 전송하는 것이 가장 좋습니다.

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

> [!NOTE] HINT
> 여기서는 HttpStatus 를 사용했습니다. 이것은 @nestjs/common 패키지에서 가져온 핼퍼 열거형입니다.

`HttpException` 생성자는 응답을 결정하는 두 개의 필수 인수를 받습니다.

- 응답인수는 JSON 응답 본문을 정의합니다. 아래 설명된 대로 문자열 또는 객체일 수 있습니다.
- status 인수는 HTTP 상태코드를 정의합니다.

기본적으로 JSON 응답 본문에는 두 가지 속성이 포함됩니다.

- statusCode: 기본적으로 status 인수에 제공된 HTTP 상태 코드를 사용합니다.
- message: 상태에 따른 HTTP 오류에 대한 간단한 설명

JSON 응답 본문의 메시지 부분만 재정의하려면 응답 인수에 문자열을 입력합니다. 전체 JSON 응답 본문을 재정의하려면 응답 인수에 객체를 전달합니다. Nest는 객체를 직렬화하여 JSON 응답 본문으로 반환합니다.

두 번째 생성자 인수인 상태는 유효한 HTTP 상태 코드여야 합니다. 가장 좋은 방법은 `@nestjs/common`에서 가져온 `HttpStatus` 열거형을 사용하는 것입니다.

오류 원인을 제공하는 데 사용할 수 있는 세 번째 생성자 인수(선택 사항)인 옵션이 있습니다. 이 원인 객체는 응답 객체로 직렬화되지는 않지만 로깅 목적으로 유용할 수 있으며, `HttpException`을 발생시킨 내부 오류에 대한 중요한 정보를 제공합니다.

```typescript
@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```

## Custom exceptions[#](https://docs.nestjs.com/exception-filters#custom-exceptions)

대부분의 경우 사용자 정의 예외를 작성할 필요가 없으며, 다음 섹션에 설명된 대로 기본 제공 Nest HTTP 예외를 사용할 수 있습니다. 사용자 정의 예외를 작성해야 하는 경우에는 사용자 정의 예외가 기본 `HttpException` 클래스에서 상속되는 자체 예외 계층 구조를 만드는 것이 좋습니다. 이 접근 방식을 사용하면 Nest가 예외를 인식하고 오류 응답을 자동으로 처리합니다.

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

## Built-in HTTP exceptions[#](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)

`Nest`는 기본 `HttpException`에서 상속되는 일련의 표준 예외를 제공합니다. 이러한 예외는 `@nestjs/common` 패키지에서 노출되며, 가장 일반적인 HTTP 예외 중 다수를 나타냅니다.

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

모든 기본 제공 예외는 `cause` 매개변수를 사용하여 오류 원인과 오류 설명을 모두 제공할 수도 있습니다.

```typescript
throw new BadRequestException("Something bad happened", { cause: new Error(), description: "Some error description" });
```

## Exception filters[#](https://docs.nestjs.com/exception-filters#exception-filters-1)

기본 예외 필터가 많은 경우를 자동으로 처리할 수 있지만 예외 계층을 완전히 제어하고 싶을 수도 있습니다. 예를 들어 로깅을 추가하거나 일부 동적 요인에 따라 다른 JSON 스키마를 사용하고 싶을 수 있습니다. 예외 필터는 바로 이러한 목적을 위해 설계되었습니다. 예외 필터를 사용하면 정확한 제어 흐름과 클라이언트에 다시 전송되는 응답의 내용을 제어할 수 있습니다.

`HttpException` 클래스의 인스턴스인 예외를 포착하고 이에 대한 사용자 정의 응답 로직을 구현하는 예외 필터를 만들어 보겠습니다. 이를 위해서는 기본 플랫폼의 요청 및 응답 객체에 액세스해야 합니다. 요청 객체에 액세스하여 원본 URL을 가져와 로깅 정보에 포함시킬 수 있습니다. `Response` 객체를 사용하여 `response.json()` 메서드를 사용하여 전송된 응답을 직접 제어할 것입니다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

> [!NOTE] HINT
> 모든 예외 필터는 일반 `ExceptionFilter<T>` 인터페이스를 구현해야 합니다. 이를 위해서는 `catch(exception: T, host: ArgumentsHost)` 메서드에 지정된 서명을 제공해야 합니다. T는 예외의 유형을 나타냅니다.

> [!Warning] WARNING
> `nestjs/platform-fastify`를 사용하는 경우 `response.json()` `대신 response.send()`를 사용할 수 있습니다. fastify에서 올바른 유형을 가져오는 것을 잊지 마세요.

`@Catch(HttpException)` 데코레이터는 필요한 메타데이터를 예외 필터에 바인딩하여 이 특정 필터가 `HttpException` 유형의 예외만 찾고 있음을 Nest에 알려줍니다. `@Catch()` 데코레이터는 단일 매개변수 또는 쉼표로 구분된 목록을 사용할 수 있습니다. 이를 통해 한 번에 여러 유형의 예외에 대한 필터를 설정할 수 있습니다.

## Arguments host[#](https://docs.nestjs.com/exception-filters#arguments-host)

`catch()` 메서드의 매개변수를 살펴봅시다. `exception` 매개변수는 현재 처리 중인 예외 객체입니다. `host` 매개변수는 `ArgumentsHost` 객체입니다. `ArgumentsHost는` [실행 컨텍스트 챕터](https://docs.nestjs.com/fundamentals/execution-context)에서 자세히 살펴볼 강력한 유틸리티 객체입니다. 이 코드 샘플에서는 이 객체를 사용하여 원래 요청 처리기(예외가 발생한 컨트롤러)로 전달되는 요청 및 응답 객체에 대한 참조를 가져옵니다. 이 코드 샘플에서는 원하는 요청 및 응답 객체를 얻기 위해 `ArgumentsHost`의 몇 가지 헬퍼 메서드를 사용했습니다. `ArgumentsHost`에 대해 자세히 알아보세요.

이 수준의 추상화가 필요한 이유는 `ArgumentsHost`가 모든 컨텍스트(예: 지금 작업 중인 HTTP 서버 컨텍스트뿐만 아니라 마이크로서비스 및 웹소켓 등)에서 작동하기 때문입니다. 실행 컨텍스트 장에서는 ArgumentsHost와 그 헬퍼 함수를 사용하여 모든 실행 컨텍스트에 적합한 기본 인자에 액세스하는 방법을 살펴볼 것입니다. 이를 통해 모든 컨텍스트에서 작동하는 일반 예외 필터를 작성할 수 있습니다.

## Binding filters[#](https://docs.nestjs.com/exception-filters#binding-filters)

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

여기서는 `@UseFilters()` 데코레이터를 사용했습니다. `@Catch()` 데코레이터와 마찬가지로 단일 필터 인스턴스 또는 쉼표로 구분된 필터 인스턴스 목록을 받을 수 있습니다. 여기서는 `HttpExceptionFilter` 인스턴스를 대신 생성했습니다. 또는 인스턴스 대신 클래스를 전달하여 인스턴스화에 대한 책임을 프레임워크에 맡기고 의존성 주입을 활성화할 수도 있습니다.

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> [!NOTE] HINT
> 가능하면 인스턴스 대신 클래스를 사용하여 필터를 적용하는 것을 선호합니다. Nest는 전체 모듈에서 동일한 클래스의 인스턴스를 쉽게 재사용할 수 있으므로 메모리 사용량을 줄일 수 있습니다.

위 예제에서 `HttpExceptionFilter`는 단일 `create()` 라우트 핸들러에만 적용되어 메소드 범위가 지정됩니다. 예외 필터는 컨트롤러/리졸버/게이트웨이의 메서드 범위, 컨트롤러 범위 또는 전역 범위 등 다양한 수준에서 범위를 지정할 수 있습니다.

```typescript
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

전역범위 필터를 만드려면 다음과 같이 하면 됩니다.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

> [!Warning] WARNING
> `useGlobalFilters()` 메서드는 게이트웨이 또는 하이브리드 애플리케이션에 대한 필터를 설정하지 않습니다.

전역 범위 필터는 모든 컨트롤러와 모든 라우트 핸들러에 대해 전체 애플리케이션에서 사용됩니다. 종속성 주입과 관련하여, 모듈 외부에서 등록된 전역 필터(위 예제에서와 같이 `useGlobalFilters()`를 사용하여)는 모든 모듈의 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없습니다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 전역 범위 필터를 등록할 수 있습니다.

```typescript
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

> [!NOTE] HINT
> 이 접근 방식을 사용하여 필터에 대한 종속성 주입을 수행할 때 이 구조가 사용되는 모듈에 관계없이 필터는 실제로 전역이라는 점에 유의하세요. 이 작업은 어디에서 수행해야 할까요? 필터가 정의된 모듈(위 예제에서는 `HttpExceptionFilter`)을 선택합니다. 또한 사용 클래스만이 사용자 정의 공급자 등록을 처리하는 유일한 방법은 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

이 기술을 사용하여 필요한 만큼 필터를 추가할 수 있으며, 공급자 배열에 각각을 추가하기만 하면 됩니다.

## Catch everything[#](https://docs.nestjs.com/exception-filters#catch-everything)

처리되지 않은 모든 예외를 잡으려면(예외 유형에 관계없이) `@Catch()` 데코레이터의 매개 변수 목록을 비워 두세요(예: `@Catch()`).

아래 예시에서는 HTTP 어댑터를 사용하여 응답을 전달하고 플랫폼별 객체(요청 및 응답)를 직접 사용하지 않으므로 플랫폼에 구애받지 않는 코드가 있습니다:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

> [!WARNING] WARNING
> 모든 것을 캐치하는 예외 필터와 특정 유형에 바인딩된 필터를 결합하는 경우, 특정 필터가 바인딩된 유형을 올바르게 처리할 수 있도록 `'Catch anything'` 필터를 먼저 선언해야 합니다.

## Inheritance[#](https://docs.nestjs.com/exception-filters#inheritance)

일반적으로 애플리케이션 요구 사항을 충족하기 위해 완전히 사용자 정의된 예외 필터를 만들게 됩니다. 그러나 기본 제공되는 기본 전역 예외 필터를 단순히 확장하고 특정 요인에 따라 동작을 재정의하려는 사용 사례가 있을 수 있습니다.

기본 필터에 예외 처리를 위임하려면 `BaseExceptionFilter`를 확장하고 상속된 `catch()` 메서드를 호출해야 합니다.

```typescript
import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

> [!WARNING] WARNING
> 메서드 범위 및 컨트롤러 범위 필터를 확장하는 메서드 범위 필터는 새로 인스턴스화해서는 안 됩니다. 대신 프레임워크가 자동으로 인스턴스화하도록 하세요.

글로벌 필터는 기본 필터를 확장할 수 있습니다. 이 작업은 두 가지 방법 중 하나로 수행할 수 있습니다.

첫 번째 방법은 사용자 정의 전역 필터를 인스턴스화할 때 `HttpAdapter` 참조를 삽입하는 것입니다.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
```

두 번째 방법은 [여기](https://docs.nestjs.com/exception-filters#binding-filters)에 표시된 것처럼 `APP_FILTER` 토큰을 사용하는 것입니다.
