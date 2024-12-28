---
title: Injection scopes
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-08T01:51
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: injection-scopes
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/injection-scopes)

다른 프로그래밍 언어 배경을 가진 사람들에게는 Nest에서 거의 모든 것이 들어오는 요청에서 공유된다는 사실이 의외로 느껴질 수 있습니다. 데이터베이스에 대한 연결 풀, 전역 상태를 가진 싱글톤 서비스 등이 있습니다. Node.js는 모든 요청이 별도의 스레드에서 처리되는 요청/응답 다중 스레드 무상태 모델을 따르지 않는다는 점을 기억하세요. 따라서 싱글톤 인스턴스를 사용하는 것은 애플리케이션에 완전히 **안전** 합니다.

그러나 GraphQL 애플리케이션의 요청별 캐싱, 요청 추적, 멀티테넌시 등 요청 기반 수명이 바람직한 동작일 수 있는 에지 사례가 있습니다. 인젝션 범위는 원하는 공급자 수명 동작을 얻을 수 있는 메커니즘을 제공합니다.

## Provider scope[#](https://docs.nestjs.com/fundamentals/injection-scopes#provider-scope)

provider는 다음 범위 중 하나를 가질 수 있습니다.

|             |                                                                                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT`   | provider의 단일 인스턴스가 전체 애플리케이션에서 공유됩니다. 인스턴스 수명은 애플리케이션 수명 주기에 직접 연결됩니다. 애플리케이션이 부트스트랩되면 모든 singleton providers가 인스턴스화됩니다. 기본적으로 싱글톤 범위가 사용됩니다. |
| `REQUEST`   | 들어오는 각 요청에 대해 provider의 새 인스턴스가 독점적으로 생성됩니다. 인스턴스는 요청 처리가 완료된 후 가비지 수집됩니다.                                                                                                            |
| `TRANSIENT` | 임시 providers는 소비자 간에 공유되지 않습니다. 임시 providers를 삽입하는 각 소비자는 새로운 전용 인스턴스를 받게 됩니다.                                                                                                              |

> [!NOTE] HINT
> 대부분의 사용 사례에서는 싱글톤 범위를 사용하는 것이 **좋습니다**. 소비자 및 요청 간에 공급자를 공유하면 인스턴스가 캐시될 수 있고 애플리케이션 시작 시 한 번만 초기화가 이루어집니다.

## Usage[#](https://docs.nestjs.com/fundamentals/injection-scopes#usage)

범위 속성을 `@Injectable()` 데코레이터 옵션 객체에 전달하여 주입 범위를 지정합니다.

```typescript
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

마찬가지로 [custom providers](https://docs.nestjs.com/fundamentals/custom-providers)의 경우 provider 등록에 대한 장문 양식에서 `scope` 속성을 설정합니다.

```typescript
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

싱글톤 범위는 기본적으로 사용되며 선언할 필요가 없습니다. provider를 싱글톤 범위로 선언하려면 `scope` 속성에 `Scope.DEFAULT` 값을 사용하세요.

> [!WARNING] NOTICE
> 웹소켓 게이트웨이는 싱글톤으로 작동해야 하므로 요청 범위가 지정된 공급자를 사용해서는 안 됩니다. 각 게이트웨이는 실제 소켓을 캡슐화하며 여러 번 인스턴스화할 수 없습니다. 이 제한은 `Passport` 전략이나 `Cron` 컨트롤러와 같은 일부 다른 provders에게도 적용됩니다.

## Controller scope[#](https://docs.nestjs.com/fundamentals/injection-scopes#controller-scope)

컨트롤러에는 해당 컨트롤러에 선언된 모든 요청 메서드 핸들러에 적용되는 범위가 있을 수도 있습니다. provider 범위와 마찬가지로 controller의 범위는 수명을 선언합니다. 요청 범위 컨트롤러의 경우 각 인바운드 요청에 대해 새 인스턴스가 생성되고 요청 처리가 완료되면 가비지 수집됩니다.

`ControllerOptions` 객체의 `scope` 속성을 사용하여 컨트롤러 범위를 선언합니다.

```typescript
@Controller({
  path: "cats",
  scope: Scope.REQUEST,
})
export class CatsController {}
```

## Scope hierarchy[#](https://docs.nestjs.com/fundamentals/injection-scopes#scope-hierarchy)

`REQUEST` 범위는 인젝션 체인에 버블을 일으킵니다. `REQUEST` 범위가 지정된 공급자에 의존하는 컨트롤러는 그 자체로 요청 범위가 지정됩니다.

다음 의존성 그래프를 상상해 보세요: `CatsController <- CatsService <- CatsRepository`. `CatsService`가 요청 범위가 지정된 경우(그리고 나머지는 기본 싱글톤인 경우), CatsController는 주입된 서비스에 종속되므로 요청 범위가 지정됩니다. 종속적이지 않은 `CatsRepository`는 싱글톤 범위로 유지됩니다.

일시적 범위의 종속성은 이러한 패턴을 따르지 않습니다. 싱글톤 범위의 `DogsService`가 일시적인 `LoggerService` provider를 주입하면 새로운 인스턴스를 받게 됩니다. 그러나 `DogsService`는 싱글톤 범위로 유지되므로 아무 곳에나 주입해도 `DogsService`의 새 인스턴스로 해결되지 않습니다. 이러한 동작을 원할 경우, `DogsService`를 명시적으로 `TRANSIENT`로 표시해야 합니다.

## Request provider[#](https://docs.nestjs.com/fundamentals/injection-scopes#request-provider)

HTTP 서버 기반 애플리케이션(예: `@nestjs/platform-express` 또는 `@nestjs/platform-fastify` 사용)에서는 요청 범위 공급자를 사용할 때 원본 요청 객체에 대한 참조에 액세스하고 싶을 수 있습니다. `REQUEST` 객체를 삽입하면 이 작업을 수행할 수 있습니다.

`REQUEST` 공급자는 요청 범위가 지정되므로 이 경우 명시적으로 `REQUEST` 범위를 사용할 필요가 없습니다.

```typescript
import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

기본 플랫폼/프로토콜 차이로 인해 `Microservice` 또는 `GraphQL` 애플리케이션의 경우 인바운드 요청에 약간 다르게 액세스합니다. `GraphQL` 애플리케이션에서는 `REQUEST` 대신 `CONTEXT`를 주입합니다.

```typescript
import { Injectable, Scope, Inject } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(CONTEXT) private context) {}
}
```

그런 다음 `request`을 속성으로 포함하도록 `context` 값(`GraphQLModule`에서)을 구성합니다.

## Inquirer provider[#](https://docs.nestjs.com/fundamentals/injection-scopes#inquirer-provider)

로깅 또는 메트릭 제공자와 같이 제공자가 생성된 클래스를 가져오려면 `INQUIRER` 토큰을 삽입하면 됩니다.

```typescript
import { Inject, Injectable, Scope } from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";

@Injectable({ scope: Scope.TRANSIENT })
export class HelloService {
  constructor(@Inject(INQUIRER) private parentClass: object) {}

  sayHello(message: string) {
    console.log(`${this.parentClass?.constructor?.name}: ${message}`);
  }
}
```

그런 다음 다음과 같이 사용하세요.

```typescript
import { Injectable } from "@nestjs/common";
import { HelloService } from "./hello.service";

@Injectable()
export class AppService {
  constructor(private helloService: HelloService) {}

  getRoot(): string {
    this.helloService.sayHello("My name is getRoot");

    return "Hello world!";
  }
}
```

위의 예제에서 `AppService#getRoot`가 호출되면 `"AppService: 내 이름은 getRoot입니다"`가 콘솔에 기록됩니다.

## Performance[#](https://docs.nestjs.com/fundamentals/injection-scopes#performance)

요청 범위가 지정된 providers를 사용하면 애플리케이션 성능에 영향을 미칩니다. Nest는 가능한 한 많은 메타데이터를 캐시하려고 하지만 각 요청에 대해 클래스의 인스턴스를 생성해야 합니다. 따라서 평균 응답 시간과 전반적인 벤치마킹 결과가 느려집니다. provider가 요청 범위를 지정해야 하는 경우가 아니라면 기본 싱글톤 범위를 사용하는 것이 좋습니다.

> [!NOTE] HINT
> 이 모든 것이 상당히 위협적으로 들리지만, 요청 범위가 지정된 providers를 활용하는 적절하게 설계된 애플리케이션은 지연 시간 측면에서 최대 5% 이상 느려지지 않아야 합니다.

## Durable providers[#](https://docs.nestjs.com/fundamentals/injection-scopes#durable-providers)

위 섹션에서 언급했듯이 요청 범위가 지정된 공급자는 컨트롤러 인스턴스에 1개 이상(또는 더 깊게는 provider 중 하나에 주입)이 있으면 controller도 요청 범위가 지정되므로 지연 시간이 늘어날 수 있습니다. 즉, 각 개별 요청마다 controller를 다시 생성(인스턴스화)하고 나중에 가비지를 수집해야 합니다. 즉, 3만 개의 요청이 병렬로 발생한다고 가정하면 컨트롤러(및 요청 범위가 지정된 공급자)의 임시 인스턴스가 3만 개가 된다는 뜻이기도 합니다.

대부분의 provider가 의존하는 공통 provider(데이터베이스 연결 또는 로거 서비스 등)가 있으면 모든 provider가 자동으로 요청 범위 provider로 변환됩니다. 이는 **multi-tenant applications**, 특히 요청 개체에서 헤더/토큰을 가져와 그 값을 기반으로 해당 데이터베이스 연결/스키마(해당 테넌트에만 해당)를 검색하는 중앙 요청 범위 '데이터 소스' 공급자가 있는 애플리케이션의 경우 문제가 될 수 있습니다.

예를 들어 10명의 서로 다른 고객이 번갈아 사용하는 애플리케이션이 있다고 가정해 보겠습니다. 각 고객마다 **고유한 전용 데이터 소스**가 있고 고객 A가 고객 B의 데이터베이스에 절대 접근할 수 없도록 하고 싶을 것입니다. 이를 달성하는 한 가지 방법은 요청 개체를 기반으로 '현재 고객'을 결정하고 해당 데이터베이스를 검색하는 요청 범위가 지정된 '데이터 소스' 공급자를 선언하는 것입니다. 이 접근 방식을 사용하면 단 몇 분 만에 애플리케이션을 멀티테넌트 애플리케이션으로 전환할 수 있습니다. 하지만 이 접근 방식의 가장 큰 단점은 애플리케이션 구성 요소의 대부분이 "데이터 소스" 공급자에 의존하기 때문에 암묵적으로 "요청 범위"가 지정되므로 앱 성능에 영향을 미칠 수 있다는 것입니다.

하지만 더 나은 솔루션이 있다면 어떨까요? 고객이 10명뿐이므로 요청마다 각 트리를 다시 생성하는 대신 고객당 10개의 개별 **DI 하위 트리**를 가질 수는 없을까요? 공급업체가 각 연속 요청에 대해 진정으로 고유한 속성(예: 요청 UUID)에 의존하지 않고 대신 요청을 집계(분류)할 수 있는 특정 속성이 있다면 들어오는 모든 요청에 대해 DI 하위 트리를 다시 만들 이유가 없습니다.

바로 이때 **durable providers**가 유용합니다.

provider를 내구성 있는 것으로 플래그를 지정하기 전에 먼저 Nest에 "공통 요청 속성"이 무엇인지 알려주는 **전략**을 등록하고 요청을 그룹화하는 로직을 제공하여 해당 DI 하위 트리와 연결해야 합니다.

```typescript
import { HostComponentInfo, ContextId, ContextIdFactory, ContextIdStrategy } from "@nestjs/core";
import { Request } from "express";

const tenants = new Map<string, ContextId>();

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {
    const tenantId = request.headers["x-tenant-id"] as string;
    let tenantSubTreeId: ContextId;

    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId);
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    // If tree is not durable, return the original "contextId" object
    return (info: HostComponentInfo) => (info.isTreeDurable ? tenantSubTreeId : contextId);
  }
}
```

> [!NOTE] HINT
> 요청 범위와 마찬가지로, 내구성은 주입 체인에 `durable`을 일으킵니다. 즉, A가 durable으로 플래그가 지정된 B에 종속된 경우 A도 암시적으로 durable 됩니다(A 공급자에 대해 `durable`이 명시적으로 `false`로 설정되지 않는 한).

> [!WARNING] WARNING
> 이 전략은 많은 수의 테넌트와 함께 운영되는 애플리케이션에는 적합하지 않습니다.

`attach` 메서드에서 반환된 값은 주어진 호스트에 대해 어떤 컨텍스트 식별자를 사용해야 하는지 Nest에 지시합니다. 이 경우, 호스트 컴포넌트(예: 요청 범위 컨트롤러)가 내구성으로 플래그가 지정된 경우 원래의 자동 생성된 `contextId` 객체 대신 `tenantSubTreeId`를 사용하도록 지정했습니다(아래에서 providers를 durable으로 표시하는 방법을 확인할 수 있습니다). 또한 위의 예제에서는 **페이로드가 등록되지 않습니다**(여기서 페이로드 = 하위 트리의 부모인 "root"를 나타내는 `REQUEST`/`CONTEXT` provider).

durable 트리에 페이로드를 등록하려면 다음 구문을 대신 사용하세요.

```typescript
// The return of `AggregateByTenantContextIdStrategy#attach` method:
return {
  resolve: (info: HostComponentInfo) => (info.isTreeDurable ? tenantSubTreeId : contextId),
  payload: { tenantId },
};
```

이제 `@Inject(REQUEST)`/`@Inject(CONTEXT)`를 사용하여 `REQUEST` 공급자(또는 `GraphQL` 애플리케이션의 경우 `CONTEXT`)를 주입할 때마다 `payload` 객체가 주입됩니다(단일 속성 (이 경우 `tenantId`으로) 구성됨).

이 전략을 사용하면 코드의 어딘가에 등록할 수 있으므로(어쨌든 globally로 적용되므로) 예를 들어 `main.ts` 파일에 배치할 수 있습니다.

```typescript
ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
```

요청이 애플리케이션에 도달하기 전에 등록이 이루어지면 모든 것이 의도한 대로 작동합니다.

마지막으로 일반 provider를 durable provider로 바꾸려면 `durable` 플래그를 `true`로 설정하고 해당 범위를 `Scope.REQUEST`로 변경하면 됩니다(REQUEST 범위가 이미 인젝션 체인에 있는 경우 필요 없음).

```typescript
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST, durable: true })
export class CatsService {}
```

마찬가지로  [custom providers](https://docs.nestjs.com/fundamentals/custom-providers)의 경우 provider 등록을 위한 장문 양식에서 `durable` 속성을 설정합니다.

```typescript
{
  provide: 'foobar',
  useFactory: () => { ... },
  scope: Scope.REQUEST,
  durable: true,
}
```
