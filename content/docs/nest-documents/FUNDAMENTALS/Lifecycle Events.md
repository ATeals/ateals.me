---
title: Lifecycle Events
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-08-13T16:40:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: lifecycle-events
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/lifecycle-events)

Nest 애플리케이션과 모든 애플리케이션 요소에는 Nest에서 관리하는 라이프사이클이 있습니다. Nest는 주요 수명 주기 이벤트에 대한 가시성을 제공하는 **lifecycle hooks**을 제공하며, 이벤트가 발생하면 모듈, 공급자 또는 컨트롤러에서 등록된 코드를 실행할 수 있는 기능을 제공합니다.

## Lifecycle sequence[#](https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-sequence)

다음 다이어그램은 애플리케이션이 부트스트랩된 시점부터 노드 프로세스가 종료될 때까지의 주요 애플리케이션 수명 주기 이벤트의 순서를 보여줍니다. 전체 수명 주기를 **초기화**, **실행**, **종료**의 세 단계로 나눌 수 있습니다. 이 수명 주기를 사용하면 모듈과 서비스의 적절한 초기화를 계획하고, 활성 연결을 관리하고, 종료 신호를 받으면 애플리케이션을 정상적으로 종료할 수 있습니다.

![](https://docs.nestjs.com/assets/lifecycle-events.png)

## Lifecycle events[#](https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events-1)

라이프사이클 이벤트는 애플리케이션 부트스트랩과 종료 중에 발생합니다. Nest는 다음 각 수명 주기 이벤트에서 모듈, 공급자 및 컨트롤러에 등록된 수명 주기 훅 메서드를 호출합니다([아래](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) 설명된 대로 **shutdown hooks**을 먼저 활성화해야 함). 위의 다이어그램에서 볼 수 있듯이 Nest는 적절한 기본 메서드를 호출하여 연결 수신을 시작하고 연결 수신을 중지하기도 합니다.

다음 표에서 `onModuleDestroy`, `beforeApplicationShutdown` 및 `onApplicationShutdown`은 명시적으로 `app.close()`를 호출하거나 프로세스가 특수 시스템 신호(예: SIGTERM)를 수신하고 애플리케이션 부트스트랩에서 `enableShutdownHook`을 올바르게 호출한 경우에만 트리거됩니다(아래  **Application shutdown** 부분 참조).

| Lifecycle hook method           | Lifecycle event triggering the hook method call                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onModuleInit()`                | 호스트 모듈의 종속성이 해결되면 호출됩니다.                                                                                                                                     |
| `onApplicationBootstrap()`      | 모든 모듈이 초기화되면 호출되지만 연결을 수신 대기하기 전에 호출됩니다.                                                                                                         |
| `onModuleDestroy()`\*           | 종료 신호(예: `SIGTERM`)가 수신된 후 호출됩니다.                                                                                                                                |
| `beforeApplicationShutdown()`\* | 모든 `onModuleDestroy()` 핸들러가 완료된 후 호출되며(Promises resolved or rejected), 완료되면(Promises resolved or rejected) 기존의 모든 연결이 닫힙니다(`app.close()` 호출됨). |
| `onApplicationShutdown()`\*     | 연결이 닫힌 후 호출됩니다(`app.close()`가 해결됨).                                                                                                                              |

이러한 이벤트의 경우 `app.close()`를 명시적으로 호출하지 않는 경우 `SIGTERM`과 같은 시스템 신호와 함께 작동하도록 옵트인해야 합니다. 아래 [Application shutdown](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown)를 참조하세요.

> [!WARNING] WARNING
> 위에 나열된 라이프사이클 훅은  **request-scoped** 클래스에 대해서는 트리거되지 않습니다. 요청 범위 클래스는 애플리케이션 라이프사이클에 묶여 있지 않으며 수명을 예측할 수 없습니다. 각 요청에 대해 독점적으로 생성되며 응답이 전송된 후 자동으로 가비지 수집됩니다.

> [!NOTE] HINT
> `onModuleInit()` 및 `onApplicationBootstrap()`의 실행 순서는 이전 훅을 기다리는 모듈 가져오기 순서에 직접적으로 의존합니다.

## Usage[#](https://docs.nestjs.com/fundamentals/lifecycle-events#usage)

각 라이프사이클 훅은 인터페이스로 표현됩니다. 인터페이스는 TypeScript 컴파일 후에는 존재하지 않기 때문에 기술적으로 선택 사항입니다. 그럼에도 불구하고 강력한 타이핑 및 편집기 도구의 이점을 활용하려면 인터페이스를 사용하는 것이 좋습니다. 라이프사이클 훅을 등록하려면 적절한 인터페이스를 구현하세요. 예를 들어 특정 클래스(예: 컨트롤러, 프로바이더 또는 모듈)에서 모듈 초기화 중에 호출할 메서드를 등록하려면 아래와 같이 `onModuleInit()` 메서드를 제공하여 `OnModuleInit` 인터페이스를 구현하세요:

```typescript
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class UsersService implements OnModuleInit {
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
```

## Asynchronous initialization[#](https://docs.nestjs.com/fundamentals/lifecycle-events#asynchronous-initialization)

`OnModuleInit`과 `OnApplicationBootstrap` 훅을 사용하면 애플리케이션 초기화 프로세스를 지연시킬 수 있습니다(`Promise`를 반환하거나 메서드를 `async/await`로 표시하고 메서드 본문에서 비동기 메서드 완료를 기다림).

```typescript
async onModuleInit(): Promise<void> {
  await this.fetch();
}
```

## Application shutdown[#](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown)

`onModuleDestroy()`, `beforeApplicationShutdown()` 및 `onApplicationShutdown()` 훅은 종료 단계에서 호출됩니다(`app.close()` 명시적 호출에 대한 응답 또는 옵트인한 경우 SIGTERM과 같은 시스템 신호 수신 시). 이 기능은 컨테이너의 라이프사이클을 관리하기 위해 [Kubernetes](https://kubernetes.io/)와 함께 dynos 또는 이와 유사한 서비스를 위한  [Heroku](https://www.heroku.com/)에서 자주 사용됩니다.

셧다운 후크 리스너는 시스템 리소스를 소모하므로 기본적으로 비활성화되어 있습니다. 셧다운 훅을 사용하려면 `enableShutdownHooks()`를 호출하여 **리스너를 활성화해야** 합니다:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
```

> [!WARNING] WARNING
> 내재된 플랫폼 제한으로 인해 NestJS는 Windows에서 애플리케이션 종료 후크에 대한 지원이 제한적입니다. `SIGINT`는 물론 `SIGBREAK`와 어느 정도는 `SIGHUP`도 작동할 것으로 예상할 수 있습니다 - [자세히 보기](https://nodejs.org/api/process.html#process_signal_events). 그러나 작업 관리자에서 프로세스를 죽이는 것은 무조건적인 것이므로, 즉 애플리케이션이 이를 감지하거나 방지할 수 있는 방법이 없기 때문에 `SIGTERM`은 Windows에서는 작동하지 않습니다. Windows에서 `SIGINT`, `SIGBREAK` 등이 어떻게 처리되는지 자세히 알아보려면 libuv의 [관련 문서](https://docs.libuv.org/en/v1.x/signal.html)를 참조하세요. 또한  [Process Signal Events](https://nodejs.org/api/process.html#process_signal_events)에 대한 Node.js 문서도 참조하세요.

> [!NOTE] INFO
> `enableShutdownHooks`는 리스너를 시작하여 메모리를 소모합니다. 단일 Node 프로세스에서 여러 Nest 앱을 실행하는 경우(예: Jest로 병렬 테스트를 실행하는 경우), Node는 리스너 프로세스가 과도하게 많다고 불평할 수 있습니다. 이러한 이유로 `enableShutdownHooks`는 기본적으로 활성화되지 않습니다. 단일 노드 프로세스에서 여러 인스턴스를 실행하는 경우 이 조건에 유의하세요.

애플리케이션이 종료 신호를 받으면 해당 신호를 첫 번째 매개변수로 사용하여 등록된 `onModuleDestroy()`, `beforeApplicationShutdown()`, `onApplicationShutdown()` 메서드(위에서 설명한 순서대로)를 호출합니다. 등록된 함수가 비동기 호출을 기다리는 경우(프로미스를 반환하는 경우) Nest는 프로미스가 해결되거나 거부될 때까지 시퀀스를 계속 진행하지 않습니다.

```typescript
@Injectable()
class UsersService implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }
}
```

> [!NOTE] INFO
> `app.close()`를 호출해도 노드 프로세스가 종료되는 것이 아니라 `onModuleDestroy()` 및 `onApplicationShutdown()` 후크만 트리거되므로 일부 간격, 장기 실행 백그라운드 작업 등이 있는 경우 프로세스가 자동으로 종료되지 않습니다.
