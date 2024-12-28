---
title: Lazy loading modules
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-08-13T13:15
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: lazy-loading-modules
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/lazy-loading-modules)

기본적으로 모듈은 `eagerly` 로드되므로 애플리케이션이 로드되는 즉시 즉시 필요한지 여부에 관계없이 모든 모듈도 로드됩니다. 이는 대부분의 애플리케이션에는 괜찮지만, 시작 대기 시간("cold start")이 중요한 서버리스 환경에서 실행되는 앱/워커에는 병목 현상이 될 수 있습니다.

지연 로딩은 특정 서버리스 함수 호출에 필요한 모듈만 로드하여 부트스트랩 시간을 줄이는 데 도움이 될 수 있습니다. 또한 서버리스 함수가 "워밍업"되면 다른 모듈을 비동기적으로 로드하여 후속 호출에 대한 부트스트랩 시간을 더욱 단축할 수도 있습니다(지연된 모듈 등록).

> [!NOTE] HINT
> [Angular](https://angular.dev/) 프레임워크에 익숙하다면 [lazy-loading modules](https://angular.dev/guide/ngmodules/lazy-loading#lazy-loading-basics)이라는 용어를 본 적이 있을 것입니다. 이 기술은 Nest에서 `기능적으로 다르므로` 유사한 명명 규칙을 공유하는 완전히 다른 기능으로 생각하세요.

> [!WARNING] WARNING
> 라이프사이클 훅 메서드는 지연 로드된 모듈과 서비스에서는 호출되지 않는다는 점에 유의하세요.

## Getting started[#](https://docs.nestjs.com/fundamentals/lazy-loading-modules#getting-started)

필요에 따라 모듈을 로드하기 위해 Nest는 일반적인 방법으로 클래스에 주입할 수 있는 `LazyModuleLoader` 클래스를 제공합니다:

```typescript title="cats.service.ts"
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

또는 다음과 같이 애플리케이션 부트스트랩 파일(`main.ts`) 내에서 `LazyModuleLoader` 공급자에 대한 참조를 얻을 수 있습니다:

```typescript
// "app"은 Nest 애플리케이션 인스턴스를 나타냅니다.
const lazyModuleLoader = app.get(LazyModuleLoader);
```

이제 다음 구성을 사용하여 모든 모듈을 로드할 수 있습니다:

```typescript
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

> [!NOTE] HINT
> "지연 로드된" 모듈은 첫 번째 `LazyModuleLoader#load` 메서드 호출 시 `캐시`됩니다. 즉, 연속적으로 `LazyModule`을 로드하려고 시도할 때마다 모듈을 다시 로드하는 대신 캐시된 인스턴스를 반환하는 속도가 **매우 빨라**집니다.
>
> ```bash
> Load "LazyModule" attempt: 1
> time: 2.379ms
> Load "LazyModule" attempt: 2
> time: 0.294ms
> Load "LazyModule" attempt: 3
> time: 0.303ms
> ```
>
> 또한 "lazy loaded" 모듈은 애플리케이션 부트스트랩에서 eagerly 로드된 모듈과 앱의 나중에 등록된 다른 지연 모듈과 동일한 모듈 그래프를 공유합니다.

여기서 `lazy.module.ts`는 **일반 Nest 모듈**(추가 변경이 필요하지 않음)을 내보내는 TypeScript 파일입니다.

`LazyModuleLoader#load` 메서드는 내부 공급자 목록을 탐색하고 해당 주입 토큰을 조회 키로 사용하여 모든 공급자에 대한 참조를 얻을 수 있는 **모듈 참조**(`LazyModule`)를 반환합니다.

예를 들어 다음 정의가 있는 `LazyModule`이 있다고 가정해 보겠습니다:

```typescript
@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
```

> [!NOTE] HINT
> 힌트 지연 로드된 모듈은 **글로벌 모듈**로 등록할 수 없습니다(정적으로 등록된 모든 모듈이 이미 인스턴스화된 상태에서 온디맨드로 지연 등록되기 때문에 의미가 없습니다). 마찬가지로 등록된 **글로벌 인핸서**(가드/인터셉터 등)도 **제대로 작동하지 않습니다**.

이를 통해 다음과 같이 `LazyService` 공급자에 대한 참조를 얻을 수 있습니다:

```typescript
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

const { LazyService } = await import("./lazy.service");
const lazyService = moduleRef.get(LazyService);
```

> [!WARNING] WARNING
> **Webpack**을 사용하는 경우 `tsconfig.json` 파일을 업데이트하여 `compilerOptions.module`을 `"esnext"`로 설정하고 `"node"`를 값으로 하는 `compilerOptions.moduleResolution` 속성을 추가해야 합니다:
>
> ```json
> {
>  "compilerOptions": {
>    "module": "esnext",
>    "moduleResolution": "node",
>    ...
>  }
> }
> ```
>
> 이러한 옵션을 설정하면 **코드 분할** 기능을 활용할 수 있습니다.

## Lazy loading controllers, gateways, and resolvers[#](https://docs.nestjs.com/fundamentals/lazy-loading-modules#lazy-loading-controllers-gateways-and-resolvers)

Nest의 컨트롤러(또는 GraphQL 애플리케이션의 리졸버)는 routes/paths/topics (queries/mutations)의 집합을 나타내므로 `LazyModuleLoader` 클래스를 사용하여 **지연 로드할 수 없습니다**.

> [!danger] WARNING
> 지연 로드된 모듈 내에 등록된 Controllers,  [resolvers](https://docs.nestjs.com/graphql/resolvers) 및  [gateways](https://docs.nestjs.com/websockets/gateways)는 예상대로 작동하지 않습니다. 마찬가지로 미들웨어 함수(`MiddlewareConsumer` 인터페이스 구현)는 온디맨드 방식으로 등록할 수 없습니다.

예를 들어, 내부에 Fastify 드라이버를 사용하여 REST API(HTTP 애플리케이션)를 구축한다고 가정해 보겠습니다(`@nestjs/platform-fastify` 패키지 사용). Fastify는 애플리케이션이 준비되거나 메시지를 성공적으로 수신한 후에는 경로를 등록할 수 없습니다. 즉, 모듈의 컨트롤러에 등록된 경로 매핑을 분석하더라도 런타임에 등록할 방법이 없기 때문에 지연 로드된 모든 경로에 액세스할 수 없습니다.

마찬가지로, `@nestjs/microservices` 패키지의 일부로 제공되는 일부 전송 전략(`Kafka`, `gRPC` 또는 `RabbitMQ` 포함)은 연결이 설정되기 전에 특정  `topics/channels`을 `subscribe/listen`해야 합니다. 애플리케이션이 메시지 수신을 시작하면 프레임워크는 새 토픽을 `subscribe/listen`할 수 없게 됩니다.

마지막으로, 코드 우선 접근 방식이 활성화된 `@nestjs/graphql` 패키지는 메타데이터를 기반으로 GraphQL 스키마를 즉석에서 자동으로 생성합니다. 즉, 모든 클래스를 미리 로드해야 합니다. 그렇지 않으면 적절하고 유효한 스키마를 생성할 수 없습니다.

## Common use-cases[#](https://docs.nestjs.com/fundamentals/lazy-loading-modules#common-use-cases)

가장 일반적으로, 작업자/크론 작업/람다 및 서버리스 함수/웹훅이 입력 인수(경로 경로/날짜/쿼리 매개변수 등)에 따라 다른 서비스(다른 로직)를 트리거해야 하는 상황에서 지연 로드된 모듈을 볼 수 있습니다. 반면에 지연 로딩 모듈은 시작 시간이 다소 무관한 모놀리식 애플리케이션에는 그다지 의미가 없을 수 있습니다.Í
