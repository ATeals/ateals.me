---
title: Interceptors
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-05T14:32
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: interceptors
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/interceptors)

인터셉터는 `@Injectable()` 데코레이터로 주석이 달린 클래스이며 `NestInterceptor` 인터페이스를 구현합니다.

![](https://i.imgur.com/jcmlGSt.png)

인터셉터에는 [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)(AOP) 기법에서 영감을 얻은 유용한 기능들이 있습니다. 인터셉터를 사용하면 다음을 수행할 수 있습니다.

- 메서드 실행 전후에 추가 로직을 바인딩
- 함수에서 반환된 결과 변환
- 함수에서 던져진 예외를 변환
- 기본 함수 동작 확장
- 특정 조건에 따라 함수를 완전히 재정의(예: 캐싱 목적)

## Basics[#](https://docs.nestjs.com/interceptors#basics)

각 인터셉터는 `intercept()` 메서드를 구현하는데, 이 메서드는 두 개의 인수를 받습니다. 첫 번째는 가드와 정확히 동일한 객체인 `ExecutionContext` 인스턴스입니다. `ExecutionContext`는 `ArgumentsHost`에서 상속합니다. 앞서 예외 필터 챕터에서 `ArgumentsHost`를 살펴봤습니다. 거기서 원래 핸들러에 전달된 인수를 감싸는 래퍼이며 애플리케이션 유형에 따라 다른 인수 배열을 포함한다는 것을 보았습니다. 이 주제에 대한 자세한 내용은 [exception filters](https://docs.nestjs.com/exception-filters#arguments-host)를 다시 참조하세요.

## Execution context[#](https://docs.nestjs.com/interceptors#execution-context)

`ExecutionContext`는 `ArgumentsHost`를 확장함으로써 현재 실행 프로세스에 대한 추가 세부 정보를 제공하는 몇 가지 새로운 헬퍼 메서드도 추가합니다. 이러한 세부 정보는 광범위한 컨트롤러, 메서드 및 실행 컨텍스트에서 작동할 수 있는 보다 일반적인 인터셉터를 구축하는 데 유용할 수 있습니다. [여기](https://docs.nestjs.com/fundamentals/execution-context)에서 실행 컨텍스트에 대해 자세히 알아보세요.

## Call handler[#](https://docs.nestjs.com/interceptors#call-handler)

두 번째 인자는 `CallHandler`입니다. `CallHandler` 인터페이스는 인터셉터의 어느 지점에서 경로 핸들러 메서드를 호출하는 데 사용할 수 있는 `handle()` 메서드를 구현합니다. `intercept()` 메서드의 구현에서 `handle()` 메서드를 호출하지 않으면 라우트 핸들러 메서드는 전혀 실행되지 않습니다.

이 접근 방식은 `intercept()` 메서드가 요청/응답 스트림을 효과적으로 **래핑**한다는 것을 의미합니다. 따라서 최종 경로 핸들러 실행 전후에 사용자 정의 로직을 구현할 수 있습니다. `intercept()` 메서드에 `handle()` 호출 전에 실행되는 코드를 작성할 수 있다는 것은 분명하지만, 그 이후에 일어나는 일에 어떤 영향을 미칠까요? `handle()` 메서드는 `Observable`을 반환하므로 강력한 `RxJS` 연산자를 사용하여 응답을 추가로 조작할 수 있습니다. 객체지향 프로그래밍 용어를 사용하면 라우트 핸들러의 호출(즉, `handle()` 호출)을 **포인트컷**이라고 하며, 이는 추가 로직이 삽입되는 지점임을 나타냅니다.

예를 들어 들어 들어오는 `POST /cats` 요청을 생각해 봅시다. 이 요청은 `CatsController` 내부에 정의된 `create()` 핸들러로 향합니다. 도중에 `handle()` 메서드를 호출하지 않는 인터셉터가 호출되면 `create()` 메서드는 실행되지 않습니다. `handle()`가 호출되면(그리고 해당 `Observable`이 반환되면) `create()` 핸들러가 트리거됩니다. 그리고 `Observable`을 통해 응답 스트림이 수신되면 스트림에서 추가 작업을 수행하고 최종 결과를 호출자에게 반환할 수 있습니다.

## Aspect interception[#](https://docs.nestjs.com/interceptors#aspect-interception)

첫 번째 사용 사례는 인터셉터를 사용하여 사용자 상호 작용(예: 사용자 호출 저장, 비동기적으로 dispatching events 또는 타임스탬프 계산)을 기록하는 것입니다. 아래는 간단한 `LoggingInterceptor`를 보여줍니다.

```typescript title="logging.interceptor.ts"
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

> [!NOTE] HINT
> `NestInterceptor<T, R>`은 일반 인터페이스로, `T`는 (응답 스트림을 지원하는) `Observable<T>`의 유형을 나타내고, `R`은 `Observable<R>`로 래핑된 값의 유형을 나타냅니다.

> [!WARNING] NOTICE
> 컨트롤러, 프로바이더, 가드 등과 같은 인터셉터는 생성자를 통해 종속성을 **주입**할 수 있습니다.

`handle()`는 `RxJS` `Observable`을 반환하므로 스트림을 조작하는 데 사용할 수 있는 연산자 선택의 폭이 넓습니다. 위의 예에서는 관찰 가능한 스트림이 정상적으로 또는 예외적으로 종료될 때 익명 로깅 함수를 호출하지만 그 외에는 응답 주기를 방해하지 않는 `tap()` 연산자를 사용했습니다.

## Binding interceptors[#](https://docs.nestjs.com/interceptors#binding-interceptors)

인터셉터를 설정하기 위해 `@nestjs/common` 패키지에서 가져온 `@UseInterceptors()` 데코레이터를 사용합니다. **파이프** 및 **가드**와 마찬가지로 인터셉터도 컨트롤러 범위, 메서드 범위 또는 전역 범위로 설정할 수 있습니다.

```typescript title="cats.controller.ts"
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

위의 구조를 사용하면 `CatsController`에 정의된 각 경로 핸들러는 `LoggingInterceptor`를 사용합니다. 누군가 `GET /cats` 엔드포인트를 호출하면 표준 출력에서 다음과 같은 출력을 볼 수 있습니다.

```typescript
Before...
After... 1ms
```

인스턴스 대신 `LoggingInterceptor` 클래스를 전달하여 인스턴스화에 대한 책임을 프레임워크에 맡기고 종속성 주입을 활성화한 점에 주목하세요. 파이프, 가드 및 예외 필터와 마찬가지로 제자리 인스턴스를 전달할 수도 있습니다.

```typescript title="cats.controller.ts"
@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

앞서 언급했듯이 위의 구조는 이 컨트롤러가 선언한 모든 핸들러에 인터셉터를 첨부합니다. 인터셉터의 범위를 단일 메서드로 제한하려면 **메서드 수준**에서 데코레이터를 적용하기만 하면 됩니다.

글로벌 인터셉터를 설정하기 위해 `Nest` 애플리케이션 인스턴스의 `useGlobalInterceptors()` 메서드를 사용합니다.

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

글로벌 인터셉터는 모든 컨트롤러와 모든 라우트 핸들러에 대해 전체 애플리케이션에서 사용됩니다. 종속성 주입과 관련하여 모듈 외부에서 등록된 글로벌 인터셉터(위 예제에서와 같이 `useGlobalInterceptors()`를 사용)는 모든 모듈의 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없습니다. 이 문제를 해결하기 위해 다음 구성을 사용하여 `모든 모듈에서 직접` 인터셉터를 설정할 수 있습니다.

```typescript title="app.module.ts"
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

> [!NOTE] HINT
> 이 접근 방식을 사용하여 인터셉터에 대한 종속성 주입을 수행할 때 이 구조가 사용되는 모듈에 관계없이 인터셉터는 실제로 전역이라는 점에 유의하세요. 이 작업을 어디에서 수행해야 하나요? 인터셉터가 정의된 모듈(위 예시에서는 `LoggingInterceptor`)을 선택합니다. 또한 `useClass`만이 사용자 지정 공급자 등록을 처리하는 유일한 방법은 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

## Response mapping[#](https://docs.nestjs.com/interceptors#response-mapping)

우리는 이미 `handle()`가 `Observable`을 반환한다는 것을 알고 있습니다. 스트림에는 라우트 핸들러에서 반환된 값이 포함되어 있으므로 `RxJS`의 `map()` 연산자를 사용하여 쉽게 변경할 수 있습니다.

> [!WARNING] WARNING
> response mapping 기능은 라이브러리별 응답 전략에서는 작동하지 않습니다(`@Res()` 객체를 직접 사용하는 것은 금지됨).

프로세스를 보여주기 위해 각 응답을 간단한 방식으로 수정하는 `TransformInterceptor`를 만들어 보겠습니다. 이 함수는 `RxJS`의 `map()` 연산자를 사용하여 응답 객체를 새로 생성된 객체의 **데이터** 속성에 할당하고 새 객체를 클라이언트에 반환합니다.

```typescript title="transform.interceptor.ts"
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
```

> [!NOTE] HINT
> Nest interceptors는 동기식 및 비동기식 `intercept()` 메서드 모두에서 작동합니다. 필요한 경우 메서드를 `async`로 전환하기만 하면 됩니다.

위의 구조를 사용하면 누군가 `GET /cats` 엔드포인트를 호출하면 다음과 같은 응답이 표시됩니다(라우트 핸들러가 빈 배열 `[]`을 반환한다고 가정할 때).

```json
{
  "data": []
}
```

인터셉터는 전체 애플리케이션에서 발생하는 요구사항에 대해 재사용 가능한 솔루션을 만드는 데 큰 가치가 있습니다. 예를 들어 `null` 값이 발생할 때마다 빈 문자열 `''`로 변환해야 한다고 가정해 보겠습니다. 한 줄의 코드를 사용하여 이를 수행하고 인터셉터를 전역적으로 바인딩하여 등록된 각 핸들러에서 자동으로 사용하도록 할 수 있습니다.

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? "" : value)));
  }
}
```

## Exception mapping[#](https://docs.nestjs.com/interceptors#exception-mapping)

또 다른 흥미로운 사용 사례는 `RxJS`의 `catchError()` 연산자를 활용하여 던져진 예외를 재정의하는 것입니다.

```typescript title="errors.interceptor.ts"
import { Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err) => throwError(() => new BadGatewayException())));
  }
}
```

## Stream overriding[#](https://docs.nestjs.com/interceptors#stream-overriding)

처리기 호출을 완전히 방지하고 대신 다른 값을 반환하는 데에는 몇 가지 이유가 있습니다. 대표적인 예가 응답 시간을 개선하기 위해 캐시를 구현하는 것입니다. 캐시에서 응답을 반환하는 간단한 **cache interceptor**를 살펴보겠습니다. 현실적인 예제에서는 TTL, 캐시 무효화, 캐시 크기 등과 같은 다른 요소도 고려해야 하지만 여기서는 이 논의의 범위를 벗어납니다. 여기서는 주요 개념을 설명하는 기본 예제를 제공하겠습니다.

```typescript title="cache.interceptor.ts"
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

`CacheInterceptor`에는 하드코딩된 `isCached` 변수와 하드코딩된 응답 `[]`도 있습니다. 여기서 주목해야 할 핵심 사항은 `RxJS of()` 연산자에 의해 생성된 새 스트림을 반환하므로 라우트 핸들러가 **전혀 호출되지 않는다는 것**입니다. 누군가 `CacheInterceptor`를 사용하는 엔드포인트를 호출하면 response(하드코딩된 빈 배열)가 즉시 반환됩니다. 일반적인 솔루션을 만들려면 `Reflector`를 활용하고 사용자 정의 데코레이터를 만들 수 있습니다. `Reflector`는  [guards](https://docs.nestjs.com/guards) 챕터에 잘 설명되어 있습니다.

## More operators[#](https://docs.nestjs.com/interceptors#more-operators)

`RxJS` 연산자를 사용하여 스트림을 조작할 수 있기 때문에 많은 기능을 사용할 수 있습니다. 또 다른 일반적인 사용 사례를 고려해 보겠습니다. 경로 요청에 대한 **timeouts**을 처리하고 싶다고 가정해 보겠습니다. 일정 시간이 지나도 엔드포인트에서 아무 것도 반환하지 않으면 오류 응답으로 종료하고 싶을 것입니다. 다음 구조가 이를 가능하게 합니다.

```typescript title="timeout.interceptor.ts"
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      })
    );
  }
}
```

5초가 지나면 요청 처리가 취소됩니다. `RequestTimeoutException`가 발생하기 전에 사용자 지정 로직을 추가할 수도 있습니다(예: 리소스 릴리스).
