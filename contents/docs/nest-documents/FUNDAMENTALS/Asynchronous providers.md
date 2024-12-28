---
title: Asynchronous providers
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-05T17:36
draft: 
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: asynchronous-providers
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/async-providers)

때로는 하나 이상의 `비동기 작업`이 완료될 때까지 애플리케이션 시작을 지연시켜야 하는 경우가 있습니다. 예를 들어 데이터베이스와의 연결이 설정될 때까지 요청 수락을 시작하지 않으려는 경우가 있습니다. 비동기 공급자를 사용하면 이를 달성할 수 있습니다.

이를 위한 구문은 `useFactory` 구문과 함께 `async/await`을 사용하는 것입니다. 팩토리는 `Promise`를 반환하고, 팩토리 함수는 비동기 작업을 `await`할 수 있습니다. Nest는 이러한 프로바이더에 의존(주입)하는 클래스를 인스턴스화하기 전에 `Promise`의 해결을 기다립니다.

```typescript
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

> [!NOTE] HINT
> [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서  custom provider 구문에 대해 자세히 알아보세요.

## Injection[#](https://docs.nestjs.com/fundamentals/async-providers#injection)

Asynchronous providers는 다른 공급자와 마찬가지로 토큰에 의해 다른 컴포넌트에 주입됩니다. 위의 예시에서는 `@Inject('ASYNC_CONNECTION')` 구문을 사용합니다.

## Example[#](https://docs.nestjs.com/fundamentals/async-providers#example)

[TypeORM 레시피](https://docs.nestjs.com/recipes/sql-typeorm)에는 비동기식 공급자의 보다 실질적인 예시가 있습니다.
