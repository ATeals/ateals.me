---
title: Custom providers
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-05T16:43
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: custom-providers
---

이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/custom-providers)

이전 장에서는 의존성 주입(DI)의 다양한 측면과 Nest에서 어떻게 사용되는지에 대해 살펴봤습니다. 그 중 한 가지 예로 인스턴스(주로 서비스 공급자)를 클래스에 주입하는 데 사용되는 [constructor based](https://docs.nestjs.com/providers#dependency-injection) 의존성 주입을 들 수 있습니다. 의존성 주입이 Nest 코어에 기본적으로 내장되어 있다는 사실에 놀라지 않으실 것입니다. 지금까지는 한 가지 주요 패턴만 살펴보았습니다. 애플리케이션이 더 복잡해지면 DI 시스템의 모든 기능을 활용해야 할 수도 있으므로 좀 더 자세히 살펴보겠습니다.

## DI fundamentals[#](https://docs.nestjs.com/fundamentals/custom-providers#di-fundamentals)

종속성 주입은 [inversion of control (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control)를 자체 코드에서 필수적으로 수행하는 대신 IoC 컨테이너(이 경우 NestJS 런타임 시스템)에 위임하는 제어의 역전(IoC) 기법입니다. [Providers chapter](https://docs.nestjs.com/providers)의 이 예제에서 어떤 일이 일어나고 있는지 살펴봅시다.

먼저 프로바이더를 정의합니다. `Injectable()` 데코레이터는 `CatsService` 클래스를 프로바이더로 표시합니다.

```typescript title="cats.service.ts"
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

그런 다음 Nest가 컨트롤러 클래스에 프로바이더를 주입하도록 요청합니다.

```typescript title="cats.controller.ts"
import { Controller, Get } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

마지막으로 Nest IoC 컨테이너에 provider를 등록합니다.

```typescript title="app.module.ts"
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

이 작업을 위해 정확히 어떤 일이 일어나고 있을까요? 이 과정에는 세 가지 핵심 단계가 있습니다.

1. `cats.service.ts`에서 `@Injectable()` 데코레이터는 Nest IoC 컨테이너에서 관리할 수 있는 클래스로 `CatsService` 클래스를 선언합니다.

2. `cats.controller.ts`에서 `CatsController`는 생성자 주입을 통해 `CatsService` 토큰에 대한 종속성을 선언합니다.

3. `app.module.ts`에서 토큰 `CatsService`를 `cats.service.ts` 파일의 `CatsService` 클래스와 연결합니다. 아래에서 이 연결(등록이라고도 함)이 정확히 어떻게 이루어지는지 살펴보겠습니다.

Nest IoC 컨테이너가 `CatsController`를 인스턴스화할 때, 먼저 `종속성`을 찾습니다. `CatsService` 종속성을 찾으면 등록 단계(위 #3)에 따라 `CatsService` 토큰을 조회하여 `CatsService` 클래스를 반환합니다. 기본 동작인 `SINGLETON` 범위를 가정하면 Nest는 `CatsService` 인스턴스를 생성하여 캐시한 후 반환하거나, 이미 캐시된 인스턴스가 있는 경우 기존 인스턴스를 반환합니다.

이 설명은 요점을 설명하기 위해 약간 단순화했습니다. 우리가 간과한 한 가지 중요한 부분은 종속성에 대한 코드 분석 프로세스가 매우 정교하며 애플리케이션 부트스트랩 중에 발생한다는 것입니다. 한 가지 중요한 특징은 종속성 분석(또는 "종속성 그래프 생성")이 **전이적**이라는 점입니다. 위의 예에서 `CatsService` 자체에 종속성이 있다면 종속성 역시 해결될 것입니다. 종속성 그래프는 종속성이 올바른 순서로, 즉 본질적으로 "상향식"으로 해결되도록 보장합니다. 이 메커니즘은 개발자가 복잡한 종속성 그래프를 관리할 필요를 덜어줍니다.

## Standard providers[#](https://docs.nestjs.com/fundamentals/custom-providers#standard-providers)

`@Module()` 데코레이터를 자세히 살펴봅시다. `app.module`에서 선언합니다.

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
```

`providers` 프로퍼티는 `providers` 배열을 받습니다. 지금까지는 클래스 이름 목록을 통해 이러한 공급자를 제공했습니다. 사실, `providers: [CatsService]`는 보다 완전한 구문을 줄여서 표현한 것입니다.

```typescript
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

이제 이 명시적인 구조를 보았으니 등록 프로세스를 이해할 수 있습니다. 여기서는 토큰 `CatsService`를 `CatsService` 클래스와 명확하게 연결하고 있습니다. 약식 표기는 토큰이 같은 이름의 클래스 인스턴스를 요청하는 데 사용되는 가장 일반적인 사용 사례를 단순화하기 위한 편의상 표기일 뿐입니다.

## Custom providers[#](https://docs.nestjs.com/fundamentals/custom-providers#custom-providers-1)

_Standard providers_ 가 제공하는 요구 사항을 초과하는 경우 어떻게 되나요? 다음은 몇 가지 예입니다:.

- Nest가 클래스를 인스턴스화(또는 캐시된 인스턴스를 반환)하는 대신 사용자 정의 인스턴스를 만들고자 하는 경우.
- 두 번째 종속성에서 기존 클래스를 재사용하려는 경우
- 테스트용 모의 버전으로 클래스를 재정의하려는 경우

Nest를 사용하면 이러한 경우를 처리하기 위해 사용자 정의 공급자를 정의할 수 있습니다. Nest는 custom providers를 정의하는 여러 가지 방법을 제공합니다. 몇 가지 방법을 살펴보겠습니다.

> [!NOTE] HINT
> 종속성 해결에 문제가 있는 경우 `NEST_DEBUG` 환경 변수를 설정하여 시작 중에 추가 종속성 해결 로그를 가져올 수 있습니다.

## Value providers: `useValue`[#](https://docs.nestjs.com/fundamentals/custom-providers#value-providers-usevalue)

`useValue` 구문은 상수 값을 주입하거나 외부 라이브러리를 Nest 컨테이너에 넣거나 실제 구현을 모의 객체로 대체할 때 유용합니다. Nest가 테스트 목적으로 모의 `CatsService`를 사용하도록 강제하고 싶다고 가정해 보겠습니다.

```typescript
import { CatsService } from "./cats.service";

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```

이 예제에서 `CatsService` 토큰은 `mockCatsService` 모의 객체로 해석됩니다. `useValue`에는 값(이 경우 대체하는 `CatsService` 클래스와 동일한 인터페이스를 가진 리터럴 객체)이 필요합니다. TypeScript의 [구조적 타이핑](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)으로 인해 리터럴 객체나 `new`로 인스턴스화된 클래스 인스턴스를 포함하여 호환되는 인터페이스를 가진 모든 객체를 사용할 수 있습니다.

## Non-class-based provider tokens[#](https://docs.nestjs.com/fundamentals/custom-providers#non-class-based-provider-tokens)

지금까지는 클래스 이름을 provider 토큰(`provide` 배열에 나열된 공급자의 `provider` 프로퍼티 값)으로 사용했습니다. 이는 [constructor based injection](https://docs.nestjs.com/providers#dependency-injection)에 사용되는 표준 패턴과 일치하며, 토큰도 클래스 이름입니다. (토큰에 대한 개념이 명확하지 않은 경우 [DI Fundamentals](https://docs.nestjs.com/fundamentals/custom-providers#di-fundamentals)를 다시 참조하여 토큰에 대해 다시 한 번 정리하세요.) 때로는 문자열이나 기호를 DI 토큰으로 사용하는 유연성을 원할 수도 있습니다. 예를 들어

```typescript
import { connection } from "./connection";

@Module({
  providers: [
    {
      provide: "CONNECTION",
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

이 예에서는 외부 파일에서 가져온 기존 연결 객체와 문자열 값 토큰(`'CONNECTION'`)을 `연결`하고 있습니다.

> [!WARNING] NOTICE
> 토큰 값으로 문자열을 사용하는 것 외에도 JavaScript `symbols`나 TypeScript `enums`을 사용할 수도 있습니다.

앞서 표준 [constructor based injection](https://docs.nestjs.com/providers#dependency-injection) 패턴을 사용하여 프로바이더를 주입하는 방법을 살펴봤습니다. 이 패턴을 `사용하려면` 클래스 이름으로 종속성을 선언해야 합니다. `'CONNECTION'` 사용자 정의 프로바이더는 문자열 값 토큰을 사용합니다. 이러한 프로바이더를 주입하는 방법을 살펴보겠습니다. 이를 위해 `@Inject()` 데코레이터를 사용합니다. 이 데코레이터는 토큰이라는 단일 인수를 받습니다.

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject("CONNECTION") connection: Connection) {}
}
```

위의 예시에서는 예시용으로 `'CONNECTION'` 문자열을 직접 사용했지만, 깔끔한 코드 구성을 위해 토큰을 `constants.ts`와 같은 별도의 파일에 정의하는 것이 가장 좋습니다. 자체 파일에 정의하고 필요한 곳에서 가져오는 심볼이나 열거형과 마찬가지로 취급하세요.

## Class providers: `useClass`[#](https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass)

`useClass` 구문을 사용하면 토큰이 확인해야 하는 클래스를 동적으로 결정할 수 있습니다. 예를 들어 추상(또는 기본) `ConfigService` 클래스가 있다고 가정해 보겠습니다. 현재 환경에 따라 Nest에서 다른 구성 서비스 구현을 제공하고자 합니다. 다음 코드는 이러한 전략을 구현합니다.

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass: process.env.NODE_ENV === "development" ? DevelopmentConfigService : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

이 코드 샘플에서 몇 가지 세부 사항을 살펴봅시다. 먼저 리터럴 객체로 `configServiceProvider`를 정의한 다음 모듈 데코레이터의 `providers` 프로퍼티에 이를 전달한 것을 볼 수 있습니다. 이것은 약간의 코드 구성에 불과하지만 기능적으로는 이 장에서 지금까지 사용한 예제와 동일합니다.

또한 `ConfigService` 클래스 이름을 토큰으로 사용했습니다. `ConfigService`에 종속된 모든 클래스의 경우 Nest는 제공된 클래스(`DevelopmentConfigService` 또는 `ProductionConfigService`)의 인스턴스를 다른 곳에서 선언되었을 수 있는 기본 구현(예: `@Injectable()` 데코레이터로 선언된 `ConfigService`)을 재정의하여 주입합니다.

## Factory providers: `useFactory`[#](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory)

`useFactory` 구문을 사용하면 공급자를 **동적으로** 생성할 수 있습니다. 실제 공급자는 팩토리 함수에서 반환된 값으로 제공됩니다. 팩토리 함수는 필요에 따라 단순하거나 복잡할 수 있습니다. 단순한 팩토리는 다른 프로바이더에 의존하지 않을 수 있습니다. 보다 복잡한 팩토리는 결과를 계산하는 데 필요한 다른 공급자를 자체적으로 주입할 수 있습니다. 후자의 경우 팩토리 공급자 구문에는 한 쌍의 관련 메커니즘이 있습니다.

- 팩토리 함수는 (선택적) 인수를 받을 수 있습니다.
- (선택적) `inject` 프로퍼티는 인스턴스화 프로세스 중에 Nest가 확인하여 팩토리 함수에 인자로 전달할 공급자 배열을 허용합니다. 또한 이러한 공급자는 선택 사항으로 표시할 수 있습니다. 두 목록은 서로 연관되어 있어야 합니다: Nest는 인젝트 목록의 인스턴스를 동일한 순서로 팩토리 함수에 인수로 전달합니다. 아래 예시는 이를 보여줍니다.

```typescript
const connectionProvider = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider, optionalProvider?: string) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider, { token: "SomeOptionalProvider", optional: true }],
  //       \_____________/            \__________________/
  //        This provider              The provider with this
  //        is mandatory.              token can resolve to `undefined`.
};

@Module({
  providers: [
    connectionProvider,
    OptionsProvider,
    // { provide: 'SomeOptionalProvider', useValue: 'anything' },
  ],
})
export class AppModule {}
```

## Alias providers: `useExisting`[#](https://docs.nestjs.com/fundamentals/custom-providers#alias-providers-useexisting)

`useExisting` 구문을 사용하면 기존 providers 대한 별칭을 만들 수 있습니다. 이렇게 하면 동일한 provider에 액세스할 수 있는 두 가지 방법이 생성됩니다. 아래 예에서 (문자열 기반) 토큰인 `'AliasedLoggerService'`는 (클래스 기반) 토큰인 `LoggerService`의 별칭입니다. 두 개의 서로 다른 종속성이 있다고 가정합니다. 하나는 `'AliasedLoggerService'`에 대한 종속성이고 다른 하나는 `LoggerService`에 대한 종속성입니다. 두 종속성이 모두 `SINGLETON` 범위로 지정되면 둘 다 동일한 인스턴스로 resolve됩니다.

```typescript
@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  provide: "AliasedLoggerService",
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

## Non-service based providers[#](https://docs.nestjs.com/fundamentals/custom-providers#non-service-based-providers)

providers는 서비스를 제공하는 경우가 많지만, 그 용도에 국한되지 않습니다. providers는 모든(any) 값을 제공할 수 있습니다. 예를 들어 공급자는 아래 그림과 같이 현재 환경에 따라 구성 개체 배열을 제공할 수 있습니다.

```typescript
const configFactory = {
  provide: "CONFIG",
  useFactory: () => {
    return process.env.NODE_ENV === "development" ? devConfig : prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
export class AppModule {}
```

## Export custom provider[#](https://docs.nestjs.com/fundamentals/custom-providers#export-custom-provider)

다른 provider와 마찬가지로 custom provider는 선언하는 모듈로 범위가 지정됩니다. 다른 모듈에서 보이게 하려면 export해야 합니다. custom provider를 export하려면 토큰 또는 전체 공급자 개체를 사용할 수 있습니다.

다음 예제는 토큰을 사용하여 export하는 방법을 보여줍니다.

```typescript
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: ["CONNECTION"],
})
export class AppModule {}
```

또는 전체 provider 개체를 사용하여 export하세요.

```typescript
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```
