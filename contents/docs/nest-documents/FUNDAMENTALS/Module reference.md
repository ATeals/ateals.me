---
title: Module reference
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-15T18:31
draft: false
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: module-reference
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/module-ref)

Nest는 내부 providers 목록을 탐색하고 해당 주입 토큰을 조회 키로 사용하여 모든 provider에 대한 참조를 얻을 수 있는 `ModuleRef` 클래스를 제공합니다. `ModuleRef` 클래스는 정적 및 범위 지정 providers를 모두 동적으로 인스턴스화하는 방법도 제공합니다. `ModuleRef`는 일반적인 방법으로 클래스에 주입할 수 있습니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```

## Retrieving instances[#](https://docs.nestjs.com/fundamentals/module-ref#retrieving-instances)

`ModuleRef` 인스턴스(이하  **module reference**)에는 `get()` 메서드가 있습니다. 이 메서드는 인젝션 토큰/클래스 이름을 사용하여 현재 모듈에 존재하는(인스턴스화된) provider, controller 또는 인젝터블(예: guard, interceptor 등)을 검색합니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

> [!WARNING] WARNING
> `get()` 메서드에서는 범위가 지정된 providers(일시적 또는 요청 범위)를 검색할 수 없습니다. 대신 [아래](https://docs.nestjs.com/fundamentals/module-ref#resolving-scoped-providers)에 설명된 기술을 사용하세요. [여기](https://docs.nestjs.com/fundamentals/injection-scopes)에서 범위를 제어하는 방법을 알아보세요.

글로벌 컨텍스트에서 provider를 검색하려면(예: provider가 다른 모듈에 삽입된 경우) `{ strict: false }` 옵션을 `get()`의 두 번째 인수로 전달합니다.

```typescript
this.moduleRef.get(Service, { strict: false });
```

## Resolving scoped providers[#](https://docs.nestjs.com/fundamentals/module-ref#resolving-scoped-providers)

범위가 지정된 provider(일시적 또는 요청 범위)를 동적으로 확인하려면 provider의 인젝션 토큰을 인수로 전달하여 `resolve()` 메서드를 사용합니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

`resolve()` 메서드는 자체 **DI 컨테이너 하위 트리**에서 공급자의 고유한 인스턴스를 반환합니다. 각 하위 트리에는 고유한 **컨텍스트 식별자**가 있습니다. 따라서 이 메서드를 두 번 이상 호출하고 인스턴스 참조를 비교하면 동일하지 않다는 것을 알 수 있습니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService),
      this.moduleRef.resolve(TransientService),
    ]);
    console.log(transientServices[0] === transientServices[1]); // false
  }
}
```

여러 번의 `resolve()` 호출에 걸쳐 단일 인스턴스를 생성하고 생성된 동일한 DI 컨테이너 하위 트리를 공유하도록 하려면 `resolve()` 메서드에 컨텍스트 식별자를 전달하면 됩니다. 컨텍스트 식별자를 생성하려면 `ContextIdFactory` 클래스를 사용합니다. 이 클래스는 적절한 고유 식별자를 반환하는 `create()` 메서드를 제공합니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }
}
```

## Registering `REQUEST` provider[#](https://docs.nestjs.com/fundamentals/module-ref#registering-request-provider)

수동으로 생성된 컨텍스트 식별자(`ContextIdFactory.create()`를 사용)는 Nest 종속성 주입 시스템에 의해 인스턴스화 및 관리되지 않으므로 `REQUEST` 공급자가 `undefined`인 DI 하위 트리를 나타냅니다.

수동으로 생성된 DI 하위 트리에 대한 사용자 정의 `REQUEST` 객체를 등록하려면 다음과 같이 `ModuleRef#registerRequestByContextId()` 메서드를 사용합니다.

```typescript
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(/* YOUR_REQUEST_OBJECT */, contextId);
```

## Getting current sub-tree[#](https://docs.nestjs.com/fundamentals/module-ref#getting-current-sub-tree)

요청 컨텍스트 내에서 요청 범위가 지정된 provider의 인스턴스를 확인해야 하는 경우가 있습니다. `CatsService`가 요청 범위가 지정되어 있고 요청 범위가 지정된 provider로 표시된 `CatsRepository` 인스턴스를 확인하고자 한다고 가정해 보겠습니다. 동일한 DI 컨테이너 하위 트리를 공유하려면 새 컨텍스트 식별자를 생성하는 대신 현재 컨텍스트 식별자를 가져와야 합니다(예: 위 그림과 같이 `ContextIdFactory.create()` 함수를 사용). 현재 컨텍스트 식별자를 가져오려면 `@Inject()` 데코레이터를 사용하여 요청 객체를 주입하는 것으로 시작하세요.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService {
  constructor(@Inject(REQUEST) private request: Record<string, unknown>) {}
}
```

> [!NOTE] HINT
> [여기](https://docs.nestjs.com/fundamentals/injection-scopes#request-provider)에서 request provider에 대해 자세히 알아보세요.

이제 `ContextIdFactory` 클래스의 `getByRequest()` 메서드를 사용하여 요청 객체를 기반으로 컨텍스트 ID를 생성하고 이를 `resolve()` 호출에 전달합니다.

```typescript
const contextId = ContextIdFactory.getByRequest(this.request);
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);
```

## Instantiating custom classes dynamically[#](https://docs.nestjs.com/fundamentals/module-ref#instantiating-custom-classes-dynamically)

이전에 **provider로 등록되지 않은** 클래스를 동적으로 인스턴스화하려면 모듈 참조의 `create()` 메서드를 사용합니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
```

이 기술을 사용하면 프레임워크 컨테이너 외부에서 다양한 클래스를 조건부로 인스턴스화할 수 있습니다.
