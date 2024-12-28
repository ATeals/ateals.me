---
title: Middleware
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-29T17:22:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: middleware
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/middleware)

`middleware`는 `Route handler` 앞에 호출되는 함수입니다. `middleware` 함수는 애플리케이션의 요청-응답 주기에서 `request`, `response` 객체와 `next()` `middleware` 함수에 엑세스 할 수 있습니다. 다음 `middleware` 함수는 일반적으로 `next`라는 변수로 표시됩니다.

![](https://i.imgur.com/LXGku0S.png)

`Nest`의 `middleware`는 기본적으로 `express middleware`와 동일합니다. `express`에서는 `middleware`에 대해 다음과 같이 설명합니다.

> `middleware` 함수는 다음 작업을 수행할 수 있습니다.
>
> - 코드를 실행합니다.
> - `request`, `response` 객체를 변경합니다.
> - 요청-응답 사이클을 종료합니다.
> - 스텍에서 다음 미들웨어 함수를 호출합니다.
> - 현재 미들웨어 함수가 요청-응답 사이클을 종료하지 않으면 다음 미들웨어 함수에 제어권을 넘기기 위해 `next()`를 호출해야 합니다. 그렇지 않으면 요청이 중단된 상태로 유지됩니다.

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## Dependency injection[#](https://docs.nestjs.com/middleware#dependency-injection)

`Nest` `middleware`는 의존성 주입을 완벽하게 지원합니다. `providers`, `controllers`와 마찬가지로 동일한 모듈 내에서 사용할 수 있는 종속성을 주입할 수 있습니다. 평소와 마찬가지로 생성자를 통해 수행됩니다.

## Applying middleware[#](https://docs.nestjs.com/middleware#applying-middleware)

`@Module()` 데코레이터에는 `middleware를` 위한 자리가 없습니다. 대신 모듈 클래스의 `configure()`메서드를 사용하여 설정합니다. 미들웨어를 포함하는 모듈은 `NestModule interface`를 구현해야 합니다.

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

예시에서는 `CatsController` 내부에 정의된 `/cats` 경로 핸들러에 대한 `LoggerMiddleware를` 설정했습니다. 또한 `middleware를` 구성할 때 경로와 요청 메서드가 포함된 객체를 `forRoutes()` 메서드에 전달하여 미들웨어를 특정 요청 메서드로 제한할 수도 있습니다. 아래 예제에서는 원하는 요청 메서드 유형을 참조하기 위해 `RequestMethod` 열거형을 가져온 것을 볼 수 있습니다.

```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

> [!NOTE] HINT
> `config()` 메서드는 비동기화 할 수 있습니다.

> [!Warning] WARNING
> `express`를 사용할 때 Nest 앱은 기본적으로 패키지 `body-parser`에서 json 및 urlencoded를 등록합니다. 즉, `MiddlewareConsumer`를 통해 해당 미들웨어를 사용자 정의 하려면 `NestFactory.create()`로 애플리케이션을 생성할때 `bodyParser` 플래그를 `false`로 설정하여 전역 미들웨어를 꺼야 합니다.

## Route wildcards[#](https://docs.nestjs.com/middleware#route-wildcards)

패턴 기반 경로도 지원됩니다.

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

## Middleware consumer[#](https://docs.nestjs.com/middleware#middleware-consumer)

`MiddlewareConsumer`는 헬퍼 클래스입니다. 미들웨어를 관리하기 위한 몇가지 내장 메서드를 제공합니다. 이 모든 메서드는 간단히 연결할 수 있습니다. `forRoutes()` 메서드는 단일 문자열, 여러 문자열, `RouteInfo` 객체, 컨트롤러 클래스, 심지어 여러 컨트롤러 클래스를 받을 수 있습니다. 대부분의 경우 쉼표로 구분된 컨트롤러 목록을 전달할 것입니다.

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```

> [!NOTE] HINT
> `apply()` 메서드는 단일 미들웨어를 받거나 여러 미들웨어를 지정하기 위해 여러 인수를 받을 수 있습니다.

## Excluding routes[#](https://docs.nestjs.com/middleware#excluding-routes)

특정 경로를 미들웨어 적용 대상에서 제외하고 싶을때가 있습니다. `exclude()` 메서드를 사용하면 특정 경로를 쉽게 제외할 수 있습니다. 이 메서드는 아래와 같이 제외할 경로를 식별하는 단일 문자열, 여러 문자열 또는 `RouteInfo` 객체를 받을 수 있습니다.

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude({ path: 'cats', method: RequestMethod.GET }, { path: 'cats', method: RequestMethod.POST }, 'cats/(.*)')
  .forRoutes(CatsController);
```

위 예시에서는 3개의 경로를 제외한 `CatsController` 내부에 정의된 모든 경로에 바인딩 됩니다.

## Excluding routes[#](https://docs.nestjs.com/middleware#excluding-routes)

우리가 사용한 LoggerMiddleware 클래스는 매우 단순합니다. 맴버도 없고, 추가 메서드도 없으며 종속성도 없습니다. 클래스 대신 간단한 함수로 정의할 수 없을까요? 사실 가능합니다. 이러한 유형의 미들웨어를 함수형 미들웨어라고 합니다. 차이점을 설명하기 위해 로거 미들웨어를 클래스 기반에서 함수형 미들웨어로 변환해 보겠습니다.

```typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

```typescript
consumer.apply(logger).forRoutes(CatsController);
```

> [!NOTE] HINT
> 미들웨어 종속성이 필요하지 않은 경우 언제든지 더 간단한 기능의 미들웨어 대안을 사용하는 것을 고려하세요

## Multiple middleware[#](https://docs.nestjs.com/middleware#multiple-middleware)

위에서 언급했듯이 순차적으로 실행되는 여러 미들웨어를 바인딩하려면 `apply()` 메서드 안에 쉼표로 구분된 목록을 제공하면 됩니다.

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## Global middleware[#](https://docs.nestjs.com/middleware#global-middleware)

등록된 모든 경로에 미들웨어를 한 번에 바인딩하려면 I`NestApplication` 인스턴스에서 제공하는 `use()` 메서드를 사용할 수 있습니다.

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

> [!NOTE] HINT
> 글로벌 미들웨어에서 DI 컨테이너에 액세스 할 수 없습니다. `app.use()` 를 사용할 때 함수형 미들웨어를 대신 사용할 수 있습니다. 또는 클래스 미들웨어를 사용하고 `Module` 내에서 `.forRoutes('*')` 를 사용할 수 있습니다.
