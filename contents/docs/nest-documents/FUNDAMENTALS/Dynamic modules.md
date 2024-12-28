---
title: Dynamic modules
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-05T17:40
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: dynamic-modules
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/dynamic-modules)

[Modules chapter](https://docs.nestjs.com/modules)에서는 Nest 모듈의 기본 사항을 다루며 [dynamic modules](https://docs.nestjs.com/modules#dynamic-modules)에 대한 간략한 소개가 포함되어 있습니다. 이 장에서는 동적 모듈에 대한 주제를 확장합니다. 이 장이 끝나면 동적 모듈이 무엇이고 언제 어떻게 사용하는지 잘 이해하게 될 것입니다.

## Introduction[#](https://docs.nestjs.com/fundamentals/dynamic-modules#introduction)

이 문서의 개요 섹션에 있는 대부분의 애플리케이션 **코드 예제**는 일반 모듈 또는 정적 모듈을 사용합니다. 모듈은 전체 애플리케이션의 모듈식 부분으로 함께 들어맞는 **provider** 및 **controllers**와 같은 구성 요소 그룹을 정의합니다. 모듈은 이러한 컴포넌트에 대한 실행 컨텍스트 또는 범위를 제공합니다. 예를 들어 모듈에 정의된 프로바이더는 내보낼 필요 없이 모듈의 다른 멤버가 볼 수 있습니다. 공급자가 모듈 외부에 표시되어야 하는 경우 먼저 호스트 모듈에서 내보낸 다음 소비 모듈로 가져옵니다.

익숙한 예를 살펴보겠습니다.

먼저 `UsersService`를 제공하고 내보내는 `UsersModule`을 정의하겠습니다. `UsersModule`은 `UsersService`의 호스트 모듈입니다.

```typescript
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

다음으로, `UsersModule`을 가져오는 `AuthModule`을 정의하여 `UsersModule`의 내보낸 공급자를 `AuthModule` 내에서 사용할 수 있도록 하겠습니다.

```typescript
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

이러한 구성을 사용하면 예를 들어 `AuthModule`에서 호스팅되는 `AuthService`에 `UsersService`를 삽입할 수 있습니다.

```typescript
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  /*
    Implementation that makes use of this.usersService
  */
}
```

이를 정적 모듈 바인딩이라고 합니다. Nest가 모듈을 서로 연결하는 데 필요한 모든 정보는 이미 호스트와 소비 모듈에 선언되어 있습니다. 이 과정에서 어떤 일이 일어나는지 살펴봅시다. Nest는 `AuthModule` 내에서 `UsersService`를 다음과 같이 사용할 수 있게 합니다.

- `UsersModule` 인스턴스화, `UsersModule` 자체가 소비하는 다른 모듈을 일시적으로 가져오고 모든 종속성을 일시적으로 해결하는 것을 포함합니다([Custom providers](https://docs.nestjs.com/fundamentals/custom-providers) 참조).
- `AuthModule` 인스턴스화 및 `AuthModule`의 내보낸 providers를 `AuthModule`의 컴포넌트에서 사용할 수 있게 만들기(마치 `AuthModule`에서 선언된 것처럼).
- `AuthService`에 `UsersService` 인스턴스 주입.

## Dynamic module use case[#](https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-module-use-case)

정적 모듈 바인딩을 사용하면 소비 모듈이 호스트 모듈의 공급자 구성 방식에 영향을 미칠 기회가 없습니다. 이것이 왜 중요할까요? 사용 사례에 따라 다르게 동작해야 하는 범용 모듈이 있는 경우를 생각해 보세요. 이는 많은 시스템에서 '플러그인'이라는 개념과 유사하며, 일반 기능을 소비자가 사용하기 전에 약간의 구성이 필요합니다.

Nest의 좋은 예로 **configuration module**을 들 수 있습니다. 많은 애플리케이션에서 **configuration module**을 사용하여 구성 세부 정보를 외부화하는 것이 유용합니다. 이렇게 하면 개발자를 위한 개발 데이터베이스, 스테이징/테스팅 환경을 위한 스테이징 데이터베이스 등 다양한 배포에서 애플리케이션 설정을 동적으로 쉽게 변경할 수 있습니다. 구성 매개변수 관리를 구성 모듈에 위임하면 애플리케이션 소스 코드는 구성 매개변수와 독립적으로 유지됩니다.

문제는 **configuration module** 자체가 일반적('플러그인'과 유사)이기 때문에 이를 사용하는 모듈에 따라 사용자 정의해야 한다는 점입니다. 바로 이 부분에서 동적 모듈이 등장합니다. 동적 모듈 기능을 사용하면 구성 모듈을 동적으로 만들어 소비 모듈이 API를 사용하여 구성 모듈을 가져올 때 구성 모듈이 사용자 지정되는 방식을 제어할 수 있도록 할 수 있습니다.

즉, 동적 모듈은 지금까지 살펴본 정적 바인딩을 사용하는 것과 달리 한 모듈을 다른 모듈로 가져오고 가져온 모듈의 속성 및 동작을 사용자 정의할 수 있는 API를 제공합니다.

## Config module example[#](https://docs.nestjs.com/fundamentals/dynamic-modules#config-module-example)

이 섹션에서는 [configuration chapter](https://docs.nestjs.com/techniques/configuration#service)에 있는 예제 코드의 기본 버전을 사용하겠습니다. 이 장의 마지막에 완성된 버전은 [여기](https://github.com/nestjs/nest/tree/master/sample/25-dynamic-modules)에서 작업 예제로 사용할 수 있습니다.

우리의 요구 사항은 `ConfigModule`이 `options` 객체를 받아들여 사용자 정의하도록 하는 것입니다. 지원하고자 하는 기능은 다음과 같습니다. 기본 샘플은 프로젝트 루트 폴더에 있는 `.env` 파일의 위치를 하드코딩합니다. 이를 구성 가능하게 만들어 원하는 폴더에서 `.env` 파일을 관리할 수 있도록 하고 싶다고 가정해 보겠습니다. 예를 들어 프로젝트 루트 아래 `config`라는 폴더(즉, `src`의 형제 폴더)에 다양한 `.env` 파일을 저장하고 싶다고 가정해 봅시다. 다른 프로젝트에서 `ConfigModule`을 사용할 때 다른 폴더를 선택할 수 있기를 원할 것입니다.

동적 모듈은 가져오는 모듈에 매개변수를 전달하여 동작을 변경할 수 있는 기능을 제공합니다. 어떻게 작동하는지 살펴봅시다. 사용하는 모듈의 관점에서 어떻게 보일지 최종 목표에서 시작한 다음 거꾸로 작업하는 것이 도움이 됩니다. 먼저, 정적으로 구성 모듈을 `import` 하는 예제(즉, `import` 된 모듈의 동작에 영향을 주지 않는 접근 방식)를 빠르게 살펴봅시다. `@Module()` 데코레이터의 `import` 배열을 주의 깊게 살펴보세요.

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

구성 객체를 전달하는 동적 모듈 가져오기가 어떤 모습일지 생각해 보겠습니다. 이 두 예제에서 `import` 배열의 차이를 비교해 보겠습니다.

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule.register({ folder: "./config" })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

위의 동적 예시에서 어떤 일이 일어나는지 살펴봅시다. 움직이는 부분은 무엇인가요?

- `ConfigModule`은 일반 클래스이므로 `register()`라는 정적 메서드가 있어야 한다는 것을 유추할 수 있습니다. 클래스의 **인스턴스**가 아닌 구성 모듈 클래스에서 호출하기 때문에 정적 메서드라는 것을 알 수 있습니다. 참고: 곧 생성할 이 메서드는 임의의 이름을 가질 수 있지만, 관례상 `forRoot()` 또는 `register()` 중 하나로 호출해야 합니다.
- `register()` 메서드는 우리가 정의한 것이므로 원하는 입력 인수를 받을 수 있습니다. 이 경우 적절한 속성을 가진 간단한 `options` 객체를 받아들이는 것이 일반적인 경우입니다.
- 지금까지 살펴본 익숙한 `imports` 목록에 반환값이 `module` 목록이 포함되어 있으므로 `register()` 메서드가 모듈과 같은 것을 반환해야 한다는 것을 유추할 수 있습니다.

실제로 `register()` 메서드가 반환하는 것은 `DynamicModule`입니다. 동적 모듈은 정적 모듈과 동일한 프로퍼티에 `module`이라는 프로퍼티가 하나 더 추가된, 런타임에 생성되는 모듈에 불과합니다. 데코레이터에 전달된 모듈 옵션을 주의 깊게 살펴보면서 샘플 정적 모듈 선언을 빠르게 검토해 보겠습니다.

```typescript
@Module({
  imports: [DogsModule],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
```

동적 모듈은 정확히 동일한 인터페이스를 가진 객체와 `module`이라는 추가 프로퍼티를 반환해야 합니다. `module` 속성은 모듈의 이름 역할을 하며, 아래 예시와 같이 모듈의 클래스 이름과 동일해야 합니다.

> [!NOTE] HINT
> 동적 모듈의 경우 모듈 옵션 객체의 모든 속성은 **모듈을 제외**한 선택 사항입니다.

정적 `register()` 메서드는 어떨까요? 이제 이 메서드의 임무가 `DynamicModule` 인터페이스를 가진 객체를 반환하는 것임을 알 수 있습니다. 이 메서드를 호출하면 정적인 경우 모듈 클래스 이름을 나열하는 방식과 유사하게 `imports` 목록에 모듈을 효과적으로 제공하는 것입니다. 즉, 동적 모듈 API는 단순히 모듈을 반환하지만 `@Module` 데코레이터에서 프로퍼티를 수정하는 대신 프로그래밍 방식으로 프로퍼티를 지정합니다.

그림을 완성하기 위해 아직 다루어야 할 몇 가지 세부 사항이 남아 있습니다.

- 이제 `@Module()` 데코레이터의 `imports` 속성은 모듈 클래스 이름(예: `imports: [UsersModule]`)뿐만 아니라 동적 모듈을 반환하는 함수(예: `imports: [ConfigModule.register(...)]`)도 취할 수 있습니다.
- 동적 모듈은 그 자체로 다른 모듈을 임포트할 수 있습니다. 이 예에서는 그렇게 하지 않겠지만 동적 모듈이 다른 모듈의 프로바이더에 의존하는 경우 선택적 `imports` 속성을 사용하여 해당 프로바이더를 임포트할 수 있습니다. 다시 말하지만, 이는 `@Module()` 데코레이터를 사용하여 정적 모듈의 메타데이터를 선언하는 방식과 정확히 유사합니다.

이러한 이해를 바탕으로 이제 동적 `ConfigModule` 선언이 어떤 모습이어야 하는지 살펴볼 수 있습니다. 한번 살펴봅시다.

```typescript
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
```

이제 조각들이 어떻게 서로 연결되는지 명확하게 알 수 있을 것입니다. `ConfigModule.register(...)`를 호출하면 지금까지 `@Module()` 데코레이터를 통해 메타데이터로 제공했던 것과 본질적으로 동일한 속성을 가진 `DynamicModule` 객체가 반환됩니다.

그러나 동적 모듈은 아직 우리가 원하는 대로 **configure** 할 수 있는 기능을 도입하지 않았기 때문에 그다지 흥미롭지는 않습니다. 이 부분은 다음에 다루겠습니다.

## Module configuration[#](https://docs.nestjs.com/fundamentals/dynamic-modules#module-configuration)

위에서 추측한 것처럼 정적 `register()` 메서드에서 옵션 객체를 전달하는 것이 `ConfigModule`의 동작을 사용자 정의하는 가장 확실한 해결책입니다. 소비 모듈의 `import` 프로퍼티를 다시 한 번 살펴봅시다.

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule.register({ folder: "./config" })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

그러면 `options` 객체를 동적 모듈에 전달하는 작업이 잘 처리됩니다. 그러면 `ConfigModule`에서 이 `options` 객체를 어떻게 사용할까요? 잠시 생각해 봅시다. 우리는 기본적으로 `ConfigModule`이 다른 공급자가 사용할 수 있도록 주입된 서비스인 `ConfigService`를 제공하고 내보내기 위한 호스트라는 것을 알고 있습니다. 실제로 동작을 사용자 정의하기 위해 `options` 객체를 읽어야 하는 것은 바로 `ConfigService`입니다. 일단 `register()` 메서드에서 어떻게든 `options`을 `ConfigService`로 가져오는 방법을 알고 있다고 가정해 봅시다. 이 가정 하에 서비스를 몇 가지 변경하여 `options` 객체의 속성을 기반으로 동작을 사용자 지정할 수 있습니다. (참고: 당분간은 실제로 전달 방법을 결정하지 않았으므로 `options`를 하드코딩 하겠습니다. 이 문제는 곧 수정하겠습니다.)

```typescript
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { EnvConfig } from "./interfaces";

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const options = { folder: "./config" };

    const filePath = `${process.env.NODE_ENV || "development"}.env`;
    const envFile = path.resolve(__dirname, "../../", options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

이제 `ConfigService`는 옵션에서 지정한 폴더에서 `.env` 파일을 찾는 방법을 알고 있습니다.

남은 작업은 `register()` 단계의 `options` 객체를 어떻게든 `ConfigService`에 주입하는 것입니다. 물론 이를 위해 _의존성 주입_ 을 사용할 것입니다. 이것이 핵심이므로 반드시 이해해야 합니다. `ConfigModule`은 `ConfigService`를 제공합니다. `ConfigService`는 런타임에만 제공되는 `options` 객체에 따라 달라집니다. 따라서 런타임에 먼저 옵션 객체를 Nest IoC 컨테이너에 바인딩한 다음 Nest가 이를 `ConfigService`에 주입하도록 해야 합니다. **Custom providers** 장에서 공급자는 서비스뿐만 아니라 **모든 값**을 포함할 수 있으므로 종속성 주입을 사용하여 간단한 `options` 객체를 처리해도 괜찮다는 것을 기억하세요.

```typescript
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: "CONFIG_OPTIONS",
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

이제 `'CONFIG_OPTIONS'` 프로바이더를 `ConfigService`에 주입하여 프로세스를 완료할 수 있습니다. 클래스 토큰이 아닌 토큰을 사용하여 프로바이더를 정의할 때는 [여기](https://docs.nestjs.com/fundamentals/custom-providers#non-class-based-provider-tokens)에 설명된 대로 `@Inject()` 데코레이터를 사용해야 한다는 것을 기억하세요.

```typescript
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Injectable, Inject } from "@nestjs/common";
import { EnvConfig } from "./interfaces";

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject("CONFIG_OPTIONS") private options: Record<string, any>) {
    const filePath = `${process.env.NODE_ENV || "development"}.env`;
    const envFile = path.resolve(__dirname, "../../", options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

마지막으로 한 가지 참고 사항: 간단하게 하기 위해 위에서 문자열 기반 인젝션 토큰(`'CONFIG_OPTIONS'`)을 사용했지만, 가장 좋은 방법은 별도의 파일에 상수(또는 `Symbol`)로 정의하고 해당 파일을 가져오는 것입니다. 예를 들어

```typescript
export const CONFIG_OPTIONS = "CONFIG_OPTIONS";
```

## Example[#](https://docs.nestjs.com/fundamentals/dynamic-modules#example)

이 장의 전체 코드 예제는 [여기](https://github.com/nestjs/nest/tree/master/sample/25-dynamic-modules)에서 확인할 수 있습니다.

## Community guidelines[#](https://docs.nestjs.com/fundamentals/dynamic-modules#community-guidelines)

일부 `@nestjs/` 패키지에서 `forRoot`, `register`, `forFeature`와 같은 메서드가 사용되는 것을 보셨을 것이고, 이 모든 메서드의 차이점이 무엇인지 궁금하실 것입니다. 이에 대한 엄격한 규칙은 없지만 `@nestjs/` 패키지는 다음 가이드라인을 따르려고 노력합니다.

- `register`를 사용하면 호출 모듈에서만 사용할 수 있도록 특정 구성으로 동적 모듈을 구성할 수 있습니다. 예를 들어 Nest의 `@nestjs/axios`: `HttpModule.register({ baseUrl: 'someUrl' })`. 다른 모듈에서 `HttpModule.register({ baseUrl: 'somewhere else' })`를 사용하면 다른 구성을 갖게 됩니다. 원하는 만큼 많은 모듈에 대해 이 작업을 수행할 수 있습니다.
- `forRoot`의 경우 동적 모듈을 한 번 구성하고 여러 곳에서 해당 구성을 재사용할 것으로 예상됩니다(추상화되어 있기 때문에 자신도 모르게 재사용할 수도 있지만). 이것이 바로 하나의 `GraphQLModule.forRoot()`, 하나의 `TypeOrmModule.forRoot()` 등이 있는 이유입니다.
- `forFeature`, 동적 모듈의 `forRoot` 구성을 사용해야 하지만 호출 모듈의 필요에 따라 일부 구성을 수정해야 하는 경우(예: 이 모듈이 액세스해야 하는 저장소 또는 로거가 사용해야 하는 컨텍스트)가 예상됩니다.

이 모든 것에는 일반적으로 비동기 대응 함수인 `registerAsync`, `forRootAsync`, `forFeatureAsync`가 있으며, 이는 같은 의미이지만 구성에도 Nest의 의존성 주입을 사용합니다.

## Configurable module builder[#](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder)

비동기 메서드(`registerAsync`, `forRootAsync` 등)를 노출하는 고도로 구성 가능한 동적 모듈을 수동으로 생성하는 것은 특히 초보자에게 매우 복잡하므로 Nest는 이 과정을 용이하게 하고 단 몇 줄의 코드만으로 모듈 "청사진"을 구성할 수 있는 `ConfigurableModuleBuilder` 클래스를 노출하고 있습니다.

예를 들어, 위에서 사용한 예제(`ConfigModule`)를 `ConfigurableModuleBuilder`를 사용하도록 변환해 보겠습니다. 시작하기 전에 `ConfigModule`이 어떤 옵션을 사용할지 나타내는 전용 인터페이스를 만들어 보겠습니다.

```typescript
export interface ConfigModuleOptions {
  folder: string;
}
```

이렇게 하면 기존 `config.module.ts` 파일과 함께 새 전용 파일을 만들고 이름을 `config.module-definition.ts`로 지정합니다. 이 파일에서 `ConfigurableModuleBuilder`를 활용하여 `ConfigModule` 정의를 작성해 보겠습니다.

```typescript title="config.module-definition.ts"
import { ConfigurableModuleBuilder } from "@nestjs/common";
import { ConfigModuleOptions } from "./interfaces/config-module-options.interface";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
```

이제 `config.module.ts` 파일을 열고 자동 생성된 `ConfigurableModuleClass를` 활용하도록 구현을 수정해 보겠습니다.

```typescript
import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigurableModuleClass } from "./config.module-definition";

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
```

`ConfigurableModuleClass`를 확장한다는 것은 이제 `ConfigModule`이 (이전 사용자 정의 구현에서와 같이) `register` 메서드뿐만 아니라 비동기 팩토리를 제공하여 소비자가 해당 모듈을 비동기적으로 구성할 수 있도록 하는 `registerAsync` 메서드도 제공한다는 의미입니다(예: 비동기 팩토리를 제공함으로써).

```typescript
@Module({
  imports: [
    ConfigModule.register({ folder: "./config" }),
    // or alternatively:
    // ConfigModule.registerAsync({
    //   useFactory: () => {
    //     return {
    //       folder: './config',
    //     }
    //   },
    //   inject: [...any extra dependencies...]
    // }),
  ],
})
export class AppModule {}
```

마지막으로, 지금까지 사용한 `'CONFIG_OPTIONS'` 대신 생성된 모듈 옵션의 providers를 삽입하도록 `ConfigService` 클래스를 업데이트해 보겠습니다.

```typescript
@Injectable()
export class ConfigService {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions) { ... }
}
```

## Custom method key[#](https://docs.nestjs.com/fundamentals/dynamic-modules#custom-method-key)

`ConfigurableModuleClass`는 기본적으로 `register`와 그에 대응하는 `registerAsync` 메서드를 제공합니다. 다른 메서드 이름을 사용하려면 다음과 같이 `ConfigurableModuleBuilder#setClassMethodName` 메서드를 사용하세요.

```typescript title="config.module-definition.ts"
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ConfigModuleOptions>()
  .setClassMethodName("forRoot")
  .build();
```

이 구성은 `ConfigurableModuleBuilder`가 대신 `forRoot` 및 `forRootAsync`를 노출하는 클래스를 생성하도록 지시합니다. 예시.

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ folder: "./config" }), // <-- note the use of "forRoot" instead of "register"
    // or alternatively:
    // ConfigModule.forRootAsync({
    //   useFactory: () => {
    //     return {
    //       folder: './config',
    //     }
    //   },
    //   inject: [...any extra dependencies...]
    // }),
  ],
})
export class AppModule {}
```

## Custom options factory class[#](https://docs.nestjs.com/fundamentals/dynamic-modules#custom-options-factory-class)

`registerAsync` 메서드(또는 구성에 따라 `forRootAsync` 또는 다른 이름)는 소비자가 모듈 구성을 확인하는 provider 정의를 전달할 수 있으므로 라이브러리 소비자는 잠재적으로  configuration object를 구성하는 데 사용할 클래스를 제공할 수 있습니다.

```typescript
@Module({
  imports: [
    ConfigModule.registerAsync({
      useClass: ConfigModuleOptionsFactory,
    }),
  ],
})
export class AppModule {}
```

이 클래스는 기본적으로 모듈 configuration 객체를 반환하는 `create()` 메서드를 제공해야 합니다. 그러나 라이브러리가 다른 명명 규칙을 따르는 경우 해당 동작을 변경하고 `ConfigurableModuleBuilder#setFactoryMethodName` 메서드를 사용하여 다른 메서드(예: `createConfigOptions`)를 기대하도록 `ConfigurableModuleBuilder`에 지시할 수 있습니다.

```typescript title="config.module-definition.ts"
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ConfigModuleOptions>()
  .setFactoryMethodName("createConfigOptions")
  .build();
```

이제 `ConfigModuleOptionsFactory` 클래스는 `create` 대신 `createConfigOptions` 메서드를 노출해야 합니다.

```typescript
@Module({
  imports: [
    ConfigModule.registerAsync({
      useClass: ConfigModuleOptionsFactory, // <-- this class must provide the "createConfigOptions" method
    }),
  ],
})
export class AppModule {}
```

## Extra options[#](https://docs.nestjs.com/fundamentals/dynamic-modules#extra-options)

모듈의 동작 방식을 결정하는 추가 옵션(이러한 옵션의 좋은 예는 `isGlobal` 플래그 또는 그냥 글로벌)이 필요하지만 동시에 `MODULE_OPTIONS_TOKEN` provider에 포함되어서는 안 되는 에지 케이스가 있습니다(예: 해당 모듈 내에 등록된 services/providers와 관련이 없으므로 `ConfigService`는 호스트 모듈이 글로벌 모듈로 등록되어 있는지 여부를 알 필요가 없음).

이러한 경우 `ConfigurableModuleBuilder#setExtras` 메서드를 사용할 수 있습니다. 다음 예시를 참조하세요.

```typescript
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ConfigModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    })
  )
  .build();
```

위의 예에서 `setExtras` 메서드에 전달된 첫 번째 인수는 "extra" 속성의 기본값을 포함하는 객체입니다. 두 번째 인수는 자동 생성된 모듈 정의(`provider`, `exports` 등 포함)와 `extras` 속성(소비자가 지정하거나 기본값)을 나타내는 `extras` 객체를 받는 함수입니다. 이 함수의 반환 값은 수정된 모듈 정의입니다. 이 구체적인 예에서는 `extras.isGlobal` 속성을 가져와 모듈 정의의 `global` 속성에 할당합니다(모듈이 전역인지 아닌지를 결정합니다. 자세한 내용은 [여기](https://docs.nestjs.com/modules#dynamic-modules)에서 참조하세요).

이제 이 모듈을 사용할 때 다음과 같이 추가 `isGlobal` 플래그를 전달할 수 있습니다.

```typescript
@Module({
  imports: [
    ConfigModule.register({
      isGlobal: true,
      folder: "./config",
    }),
  ],
})
export class AppModule {}
```

그러나 `isGlobal`은 "extra" 속성으로 선언되었으므로 `MODULE_OPTIONS_TOKEN` provider에서는 사용할 수 없습니다.

```typescript
@Injectable()
export class ConfigService {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions) {
    // "options" object will not have the "isGlobal" property
    // ...
  }
}
```

## Extending auto-generated methods[#](https://docs.nestjs.com/fundamentals/dynamic-modules#extending-auto-generated-methods)

자동 생성된 정적 메서드(`register`, `registerAsync` 등)는 필요한 경우 다음과 같이 확장할 수 있습니다.

```typescript
import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigurableModuleClass, ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } from "./config.module-definition";

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.register(options),
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    };
  }
}
```

모듈 정의 파일에서 내보내야 하는 `OPTIONS_TYPE` 및 `ASYNC_OPTIONS_TYPE` 유형 사용에 유의하세요.

```typescript
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
```
