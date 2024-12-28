---
title: Testing
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-08-14T13:55
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: testing-nest
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/testing)

자동화된 테스트는 모든 진지한 소프트웨어 개발 노력의 필수적인 부분으로 간주됩니다. 자동화를 사용하면 개발 중에 개별 테스트 또는 테스트 세트를 쉽고 빠르게 반복할 수 있습니다. 이를 통해 릴리스가 품질 및 성능 목표를 충족하도록 보장할 수 있습니다. 자동화는 커버리지를 늘리고 개발자에게 더 빠른 피드백 루프를 제공하는 데 도움이 됩니다. 자동화는 개별 개발자의 생산성을 높이고 소스 코드 제어 체크인, 기능 통합 및 버전 릴리스와 같은 중요한 개발 수명 주기 시점에 테스트를 실행할 수 있도록 합니다.

이러한 테스트는 단위 테스트, e2e 테스트, 통합 테스트 등 다양한 유형에 걸쳐 있는 경우가 많습니다. 테스트의 이점은 의심할 여지가 없지만 설정하는 것이 지루할 수 있습니다. Nest는 효과적인 테스트를 포함한 개발 모범 사례를 장려하기 위해 노력하고 있으므로 개발자와 팀이 테스트를 구축하고 자동화하는 데 도움이 되는 다음과 같은 기능이 포함되어 있습니다. Nest:

- 컴포넌트에 대한 기본 단위 테스트와 애플리케이션에 대한 e2e 테스트를 자동으로 스캐폴드합니다.\
- provides는 기본 툴링(예: 격리된 모듈/애플리케이션 로더를 빌드하는 테스트 러너)을 제공합니다.
- provides는 테스트 도구에 구애받지 않고  [Jest](https://github.com/facebook/jest) 및  [Supertest](https://github.com/visionmedia/supertest)와 바로 통합할 수 있습니다.
- 테스트 환경에서 네스트 종속성 주입 시스템을 사용하여 컴포넌트를 쉽게 모킹할 수 있습니다.

앞서 언급했듯이 Nest는 특정 툴을 강요하지 않으므로 원하는 **테스트 프레임워크**를 사용할 수 있습니다. 테스트 러너와 같이 필요한 요소만 교체하기만 하면 Nest의 기성 테스트 기능의 이점을 그대로 누릴 수 있습니다.

## Installation[#](https://docs.nestjs.com/fundamentals/testing#installation)

시작하려면 먼저 필요한 패키지를 설치하세요:

```bash
$ npm i --save-dev @nestjs/testing
```

## Unit testing[#](https://docs.nestjs.com/fundamentals/testing#unit-testing)

다음 예제에서는 두 개의 클래스를 테스트합니다: `CatsController`와 `CatsService`. 앞서 언급했듯이  [Jest](https://github.com/facebook/jest)는 기본 테스트 프레임워크로 제공됩니다. 테스트 실행자 역할을 하며 모킹, 스파이 등에 도움이 되는 어서트 함수와 테스트-더블 유틸리티도 제공합니다. 다음 기본 테스트에서는 이러한 클래스를 수동으로 인스턴스화하고 컨트롤러와 서비스가 API 계약을 이행하는지 확인합니다.

```typescript title="cats.controller.spec.ts"
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(() => {
    catsService = new CatsService();
    catsController = new CatsController(catsService);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result = ["test"];
      jest.spyOn(catsService, "findAll").mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
```

> [!NOTE] HINT
> 테스트 파일은 테스트하는 클래스 근처에 보관하세요. 테스트 파일에는 `.spec` 또는 `.test` 접미사를 붙여야 합니다.

위의 샘플은 사소한 것이기 때문에 실제로 Nest와 관련된 어떤 것도 테스트하지 않았습니다. 실제로 종속성 주입도 사용하지 않고 있습니다(`CatsService` 인스턴스를 `catsController`에 전달한 것을 주목하세요). 테스트 대상 클래스를 수동으로 인스턴스화하는 이러한 형태의 테스트는 프레임워크와 독립적이기 때문에 종종 **격리 테스트(isolated testing)** 라고 합니다. Nest 기능을 보다 광범위하게 사용하는 애플리케이션을 테스트하는 데 도움이 되는 몇 가지 고급 기능을 소개하겠습니다.

## Testing utilities[#](https://docs.nestjs.com/fundamentals/testing#testing-utilities)

`@nestjs/testing` 패키지는 보다 강력한 테스트 프로세스를 가능하게 하는 일련의 유틸리티를 제공합니다. 기본 제공 `Test` 클래스를 사용하여 이전 예제를 다시 작성해 보겠습니다:

```typescript title="cats.controller.spec.ts"
import { Test } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result = ["test"];
      jest.spyOn(catsService, "findAll").mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
```

`Test` 클래스는 기본적으로 전체 Nest 런타임을 모킹하는 애플리케이션 실행 컨텍스트를 제공하는 데 유용하지만, 모킹 및 재정의 등 클래스 인스턴스를 쉽게 관리할 수 있는 훅을 제공합니다. `Test` 클래스에는 모듈 메타데이터 객체(`@Module()` 데코레이터에 전달한 것과 동일한 객체)를 인수로 받는 `createTestingModule()` 메서드가 있습니다. 이 메서드는 몇 가지 메서드를 제공하는 `TestingModule` 인스턴스를 반환합니다. 단위 테스트의 경우 중요한 메서드는 `compile()` 메서드입니다. 이 메서드는 종속성으로 모듈을 부트스트랩하고(기존의 `main.ts` 파일에서 `NestFactory.create()`를 사용하여 애플리케이션을 부트스트랩하는 방식과 유사), 테스트할 준비가 된 모듈을 반환합니다.

> [!NOTE] HINT
> `compile()` 메서드는 **비동기적**이므로 기다려야 합니다. 모듈이 컴파일되면 `get()` 메서드를 사용하여 모듈이 선언한 모든 **정적** 인스턴스(컨트롤러 및 프로바이더)를 검색할 수 있습니다.

`TestingModule`은  [module reference](https://docs.nestjs.com/fundamentals/module-ref) 클래스를 상속하므로 범위가 지정된 공급자(일시적 또는 요청 범위)를 동적으로 확인하는 기능이 있습니다. 이 작업은 `resolve()` 메서드를 사용하여 수행합니다(`get()` 메서드는 정적 인스턴스만 검색할 수 있음).

```typescript
const moduleRef = await Test.createTestingModule({
  controllers: [CatsController],
  providers: [CatsService],
}).compile();

catsService = await moduleRef.resolve(CatsService);
```

> [!WARNING] WARNING
> `resolve()` 메서드는 자체 **DI 컨테이너 하위 트리에**서 공급자의 고유한 인스턴스를 반환합니다. 각 하위 트리에는 고유한 컨텍스트 식별자가 있습니다. 따라서 이 메서드를 두 번 이상 호출하고 인스턴스 참조를 비교하면 동일하지 않다는 것을 알 수 있습니다.

> [!NOTE] HINT
> [여기](https://docs.nestjs.com/fundamentals/module-ref)에서 모듈 참조 기능에 대해 자세히 알아보세요.

프로덕션 버전의 provider를 사용하는 대신 테스트 목적으로  [custom provider](https://docs.nestjs.com/fundamentals/custom-providers)로 재정의할 수 있습니다. 예를 들어 라이브 데이터베이스에 연결하는 대신 데이터베이스 서비스를 모의 테스트할 수 있습니다. 오버라이드는 다음 섹션에서 다루겠지만 단위 테스트에도 사용할 수 있습니다.

## Auto mocking[#](https://docs.nestjs.com/fundamentals/testing#auto-mocking)

Nest를 사용하면 누락된 모든 종속성에 적용할 모의 팩토리를 정의할 수도 있습니다. 이 기능은 클래스에 많은 종속성이 있고 모든 종속성을 모킹하는 데 시간이 오래 걸리고 설정이 많은 경우에 유용합니다. 이 기능을 사용하려면 `createTestingModule()`을 `useMocker()` 메서드와 체인으로 연결하여 의존성 모킹을 위한 팩토리를 전달해야 합니다. 이 팩토리는 인스턴스 토큰인 선택적 토큰, Nest 공급자에 유효한 모든 토큰을 받을 수 있으며 모의 구현을 반환합니다. 아래는 [`jest-mock`](https://www.npmjs.com/package/jest-mock)을 사용하여 일반 모의 객체를 생성하는 예시와 `jest.fn()`을 사용하여 `CatsService`에 대한 특정 모의 객체를 생성하는 예시입니다.

```typescript
// ...
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe("CatsController", () => {
  let controller: CatsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
    })
      .useMocker((token) => {
        const results = ["test1", "test2"];
        if (token === CatsService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(CatsController);
  });
});
```

또한 일반적으로 사용자 정의 프로바이더를 사용할 때와 마찬가지로 테스트 컨테이너에서 이러한 모형을 `moduleRef.get(CatsService)`로 검색할 수도 있습니다.

> [!NOTE] HINT
>  [`@golevelup/ts-jest`](https://github.com/golevelup/nestjs/tree/master/packages/testing)의 `createMock`과 같은 일반 모의 팩토리를 직접 전달할 수도 있습니다.

> [!NOTE] HINT
> `REQUEST` 및 `INQUIRER` 공급자는 컨텍스트에서 이미 사전 정의되어 있으므로 자동 모킹할 수 없습니다. 그러나 custom provider 구문을 사용하거나 `.overrideProvider` 메서드를 활용하여 덮어쓸 수 있습니다.

## End-to-end testing[#](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)

개별 모듈과 클래스에 초점을 맞추는 단위 테스트와 달리 e2e 테스트는 최종 사용자가 프로덕션 시스템과 상호 작용하는 방식에 더 가까운 보다 총체적인 수준에서 클래스와 모듈의 상호 작용을 다룹니다. 애플리케이션이 성장함에 따라 각 API 엔드포인트의 엔드투엔드 동작을 수동으로 테스트하기 어려워집니다. 자동화된 엔드투엔드 테스트는 시스템의 전반적인 동작이 정확하고 프로젝트 요구 사항을 충족하는지 확인하는 데 도움이 됩니다. e2e 테스트를 수행하기 위해 방금 **단위 테스트**에서 다룬 것과 유사한 구성을 사용합니다. 또한 Nest를 사용하면  [Supertest](https://github.com/visionmedia/supertest) 라이브러리를 사용하여 HTTP 요청을 쉽게 시뮬레이션할 수 있습니다.

```typescript title="cats.e2e-spec.ts"
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { CatsModule } from "../../src/cats/cats.module";
import { CatsService } from "../../src/cats/cats.service";
import { INestApplication } from "@nestjs/common";

describe("Cats", () => {
  let app: INestApplication;
  let catsService = { findAll: () => ["test"] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get("/cats").expect(200).expect({
      data: catsService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

> [!NOTE] HINT
>  [Fastify](https://docs.nestjs.com/techniques/performance)를 HTTP 어댑터로 사용하는 경우 약간 다른 구성이 필요하며 테스트 기능이 내장되어 있습니다:

```ts
let app: NestFastifyApplication;

beforeAll(async () => {
  app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

it(`/GET cats`, () => {
  return app
    .inject({
      method: "GET",
      url: "/cats",
    })
    .then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(result.payload).toEqual(/* expectedPayload */);
    });
});

afterAll(async () => {
  await app.close();
});
```

이 예제에서는 앞서 설명한 몇 가지 개념을 기반으로 구축합니다. 앞에서 사용한 `compile()` 메서드에 더해 이제 `createNestApplication()` 메서드를 사용하여 전체 Nest 런타임 환경을 인스턴스화합니다. 실행 중인 앱에 대한 참조를 `app` 변수에 저장하여 HTTP 요청을 시뮬레이션하는 데 사용할 수 있습니다.

Supertest의 `request()` 함수를 사용하여 HTTP 테스트를 시뮬레이션합니다. 이러한 HTTP 요청이 실행 중인 Nest 앱으로 라우팅되기를 원하므로 `request()` 함수에 Nest의 기반이 되는 HTTP 수신기(Express 플랫폼에서 제공될 수 있음)에 대한 참조를 전달합니다. 따라서 `request(app.getHttpServer())` 구조가 생성됩니다. `request()`를 호출하면 이제 Nest 앱에 연결된 래핑된 HTTP 서버가 전달되며, 이 서버는 실제 HTTP 요청을 시뮬레이션하는 메서드를 노출합니다. 예를 들어, `request(...).get('/cats')`을 사용하면 네트워크를 통해 들어오는 `get '/cats'`와 같은 **실제** HTTP 요청과 동일한 요청이 Nest 앱에 시작됩니다.

이 예에서는 테스트할 수 있는 하드코딩된 값을 간단히 반환하는 `CatsService`의 대체(테스트-더블) 구현도 제공합니다. 이러한 대체 구현을 제공하려면 `overrideProvider()`를 사용하세요. 마찬가지로 Nest는 모듈, 가드, 인터셉터, 필터 및 파이프를 재정의하는 메서드를 각각 `overrideModule()`, `overrideGuard()`, `overrideInterceptor()`, `overrideFilter()` 및 `overridePipe()` 메서드를 통해 제공합니다.

각 오버라이드 메서드(`overideModule()` 제외)는  [custom providers](https://docs.nestjs.com/fundamentals/custom-providers)에 대해 설명한 메서드를 미러링하는 3개의 다른 메서드가 있는 객체를 반환합니다:

- `useClass`: 객체를 재정의할 인스턴스를 제공하기 위해 인스턴스화할 클래스(공급자, 가드 등)를 제공합니다.
- `useValue`: 객체를 재정의할 인스턴스를 제공합니다.
- `useFactory`: 객체를 재정의할 인스턴스를 반환하는 함수를 제공합니다.

반면에 `overrideModule()`은 다음과 같이 원래 모듈을 재정의할 모듈을 제공하는 데 사용할 수 있는 `useModule()` 메서드가 있는 객체를 반환합니다:

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideModule(CatsModule)
  .useModule(AlternateCatsModule)
  .compile();
```

각 재정의 메서드 유형은 차례로 `TestingModule` 인스턴스를 반환하므로  [fluent style](https://en.wikipedia.org/wiki/Fluent_interface)로 다른 메서드와 체인으로 연결할 수 있습니다. 이러한 체인의 끝에서 `compile()`을 사용하여 Nest가 모듈을 인스턴스화하고 초기화하도록 해야 합니다.

또한 테스트가 실행될 때(예: CI 서버에서) 사용자 정의 로거를 제공하고자 하는 경우도 있습니다. `setLogger()` 메서드를 사용하고 `LoggerService` 인터페이스를 충족하는 객체를 전달하여 테스트 중에 `TestModuleBuilder`에 로깅하는 방법을 지시하세요(기본적으로 "오류" 로그만 콘솔에 기록됩니다).

컴파일된 모듈에는 다음 표에 설명된 대로 몇 가지 유용한 메서드가 있습니다:

|                            |                                                                                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createNestApplication()`  | 주어진 모듈을 기반으로 네스트 애플리케이션(`INestApplication` 인스턴스)을 생성하고 반환합니다. `init()` 메서드를 사용하여 애플리케이션을 수동으로 초기화해야 한다는 점에 유의하세요.                                                      |
| `createNestMicroservice()` | 주어진 모듈을 기반으로 Nest 마이크로서비스(`INestMicroservice` 인스턴스)를 생성하고 반환합니다.                                                                                                                                           |
| `get()`                    | 애플리케이션 컨텍스트에서 사용할 수 있는 컨트롤러 또는 공급자(가드, 필터 등)의 정적 인스턴스를 검색합니다.  [module reference](https://docs.nestjs.com/fundamentals/module-ref) 클래스에서 상속됩니다.                                    |
| `resolve()`                | 애플리케이션 컨텍스트에서 사용 가능한 컨트롤러 또는 공급자(가드, 필터 등 포함)의 동적으로 생성된 범위 인스턴스(요청 또는 일시적)를 검색합니다. [module reference](https://docs.nestjs.com/fundamentals/module-ref) 클래스에서 상속됩니다. |
| `select()`                 | 모듈의 종속성 그래프를 탐색하고, 선택한 모듈에서 특정 인스턴스를 검색하는 데 사용할 수 있습니다(`get()` 메서드에서 strict 모드(`strict: true`)와 함께 사용).                                                                              |

> [!NOTE] HINT
> e2e 테스트 파일은 `test` 디렉터리 안에 보관하세요. 테스트 파일에는 `.e2e-spec` 접미사가 있어야 합니다.

## Overriding globally registered enhancers[#](https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers)

global로 등록된 가드(또는 파이프, 인터셉터 또는 필터)가 있는 경우 해당 인핸서를 재정의하려면 몇 가지 단계를 더 수행해야 합니다. 원래 등록을 요약하면 다음과 같습니다:

```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
```

이것은 `APP_*` 토큰을 통해 가드를 "multi"-provider로 등록하는 것입니다. 이 슬롯에 기존 공급자를 사용해야만 `JwtAuthGuard`를 대체할 수 있습니다:

```typescript
providers: [
  {
    provide: APP_GUARD,
    useExisting: JwtAuthGuard,
    // ^^^^^^^^ 'useClass' 대신 'useExisting'을 사용한 것을 확인할 수 있습니다.
  },
  JwtAuthGuard,
],
```

> [!NOTE] HINT
> Nest가 토큰 뒤에 인스턴스화하는 대신 등록된 공급자를 참조하도록 `useClass`를 `useExisting`으로 변경하세요.

이제 `TestingModule`을 생성할 때 재정의할 수 있는 일반 공급자로 `JwtAuthGuard`가 Nest에 표시됩니다:

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(JwtAuthGuard)
  .useClass(MockAuthGuard)
  .compile();
```

이제 모든 테스트에서 모든 요청에 `MockAuthGuard`를 사용합니다.

## Testing request-scoped instances[#](https://docs.nestjs.com/fundamentals/testing#testing-request-scoped-instances)

[Request-scoped](https://docs.nestjs.com/fundamentals/injection-scopes)가 지정된 공급자는 들어오는 각 **요청**에 대해 고유하게 생성됩니다. 인스턴스는 요청 처리가 완료된 후 가비지 수집됩니다. 이는 테스트된 요청을 위해 특별히 생성된 종속성 주입 하위 트리에 액세스할 수 없기 때문에 문제가 됩니다.

위의 섹션을 통해 동적으로 인스턴스화된 클래스를 검색하는 데 `resolve()` 메서드를 사용할 수 있다는 것을 알고 있습니다. 또한 [여기](https://docs.nestjs.com/fundamentals/module-ref#resolving-scoped-providers)에 설명된 대로 고유한 컨텍스트 식별자를 전달하여 DI 컨테이너 하위 트리의 라이프사이클을 제어할 수 있다는 것도 알고 있습니다. 테스트 컨텍스트에서 이를 어떻게 활용할 수 있을까요?

전략은 컨텍스트 식별자를 미리 생성하고 Nest가 이 특정 ID를 사용하여 들어오는 모든 요청에 대한 하위 트리를 생성하도록 하는 것입니다. 이렇게 하면 테스트된 요청에 대해 생성된 인스턴스를 검색할 수 있습니다.

이를 위해 `ContextIdFactory`에서 `jest.spyOn()`을 사용합니다:

```typescript
const contextId = ContextIdFactory.create();
jest.spyOn(ContextIdFactory, "getByRequest").mockImplementation(() => contextId);
```

이제 `contextId`를 사용하여 모든 후속 요청에 대해 생성된 단일 DI 컨테이너 하위 트리에 액세스할 수 있습니다.

```ts
catsService = await moduleRef.resolve(CatsService, contextId);
```
