---
title: Modules
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-28T18:21:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: modules
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/modules)

모듈은 `@Module()` 데코레이터로 주석을 단 클래스입니다. `@Module()` 데코레이터는 Nest가 애플리케이션 구조를 구성하는 데 사용하는 `메타데이터`를 제공합니다.

![](https://i.imgur.com/j2yProx.png)

각 애플리케이션에는 하나 이상의 모듈, 즉 루트 모듈이 있습니다. 루트 모듈은 Nest가 애플리케이션 그래프를 구축하는 데 사용하는 시작점이며, 모듈과 공급자 관계 및 종속성을 해결하는 데 사용하는 내부 데이터 구조입니다.

아주 작은 애플리케이션에는 이론적으로 루트 모듈만 있을 수 있지만, 일반적인 경우는 아닙니다. 컴포넌트를 구성하는 효과적인 방법으로 모듈을 강력히 권장합니다. 따라서 대부분의 애플리케이션의 경우 결과 아키텍처는 여러 개의 모듈을 사용하며, 각 모듈은 밀접하게 관련된 기능 집합을 캡슐화합니다.

`@Module()` 데코레이터는 모듈을 설명하는 속성을 가진 단일 객체를 받습니다:

|               |                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `providers`   | Nest에 의해 인스턴스화되고 이 모듈 전체에서 공유될 수 있는 공급자                                                                                                         |
| `controllers` | 인스턴스화해야 하는 이 모듈에 정의된 컨트롤러 집합                                                                                                                        |
| `imports`     | 이 모듈에 필요한 공급자를 가져온 모듈 목록                                                                                                                                |
| `exports`     | 이 모듈에서 제공되며 이 모듈을 가져오는 다른 모듈에서 사용할 수 있어야 하는 `providers`의 하위 집합입니다. 공급자 자체 또는 토큰만 사용할 수 있습니다(`provider` value ). |

모듈은 기본적으로 `provider`를 `캡슐화`합니다. 즉, 현재 모듈에 직접 포함되지 않거나 가져온 모듈에서 내보낸 공급자를 import 할 수 없습니다. 따라서 모듈에서 내보낸 `provider`를 모듈의 공용 인터페이스 또는 API로 간주할 수 있습니다.

## Feature modules[#](https://docs.nestjs.com/modules#feature-modules)

동일한 애플리케이션 도메인에 속한 밀접한 기능은 모듈로 이동하는 것이 좋습니다. 기능 모듈은 특정 기능과 관련된 코드를 간단히 정리하여 코드를 체계적으로 유지하고 명확한 경계를 설정합니다. 이는 특히 애플리케이션, 팀의 규모가 커짐에 따라 복잡성을 관리하고 SOLID 원칙에 따라 개발하는 데 도움이 됩니다.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
```

예시에서는 CatsModule을 정의하고 이 모듈과 관련된 모든 것을 하위 디렉터리로 옮겼습니다. 이후 이 모듈을 루트 모듈로 가져와야 합니다.

```typescript
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule {}
```

예시 디렉터리 구조는 다음과 같습니다.

![](https://i.imgur.com/sOoXzhn.png)

## Shared modules[#](https://docs.nestjs.com/modules#shared-modules)

Nest에서 모듈은 기본적으로 싱글톤이므로 여러 모듈 간에 동일한 공급자의 인스턴스를 손쉽게 공유할 수 있습니다.

![](https://i.imgur.com/gURWqvT.png)

모든 모듈은 자동으로 공유모듈이 됩니다. 일단 생성되면 모든 모듈에서 재사용할 수 있습니다. 여러 다른 모듈 간에 `service` 인스턴스를 공유하고자 한다고 가정한다면, 모듈의 `exports` 배열에 `service` `provider`를 추가하여 내보내야 합니다.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

이제 `CatsModule`을 `import` 하는 모든 모듈은 `CatsService`에 엑세스 할 수 있으며 이를 `import`하는 다른 모든 모듈과도 동일한 인스턴스를 공유하게 됩니다.

## Module re-exporting[#](https://docs.nestjs.com/modules#module-re-exporting)

모듈은 내부 `provider`를 내보낼 수 있습니다. 또한 `import`한 모듈을 다시 `export`할 수 있습니다.

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class CoreModule {}
```

## Dependency injection[#](https://docs.nestjs.com/modules#dependency-injection)

모듈 클래스는 구성목적으로 provider를 주입할 수 있습니다.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

그러나 모듈 클래스 자체는 [순환 종속성](https://docs.nestjs.com/fundamentals/circular-dependency)으로 인해 provider로 주입할 수 없습니다.

## Global modules[#](https://docs.nestjs.com/modules#global-modules)

모든 곳에서 동일한 모듈을 가져와야 한다면 지루할 수 있습니다. `Nest`와 달리 `Anguler provider`는 전역에 등록됩니다. 한번 정의하면 어디서나 사용할 수 있습니다. 그러나 `Nest`는 모듈 범위 내에서 `provider`를 캡슐화 합니다. 캡슐화 모듈을 먼저 가져오지 않으면 다른곳에서 모듈의 `provider`를 사용할 수 없습니다.

데이터베이스 연결과 같이 모든 곳에서 즉시 사용할 수 있어야 하는 공급자 집합을 제공 하려는 경우 `@Global()` 데코레이터를 사용하여 모듈을 전역으로 만드세요.

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

`@Global()` 데코레이터는 모듈을 전역 범위로 만듭니다. 전역 모듈은 일반적으로 루트 또는 코어 모들에 의해 한 번만 등록되어야 합니다. 위의 예제에서 CatsService는 유비쿼터스이며, 이 서비스를 삽입하려는 모듈은 import 배열에서 CatModule을 import 할 필요 없습니다.

> [!NOTE] HINT
> 모든 것을 글로벌하게 만드는 것은 좋은 디자인 결정이 아닙니다. 글로벌 모듈을 사용하면 필요한 상용구의 양을 줄일 수 있습니다. 일반적으로 가져오기 배열은 소비자가 모듈의 API를 사용할 수 있도록 하는 데 선호되는 방법입니다.

## Dynamic modules[#](https://docs.nestjs.com/modules#dynamic-modules)

Nest 모듈 시스템에는 동적 모듈이라는 강력한 기능이 포함되어 있습니다. 이 기능을 사용하면 providers를 동적으로 등록하고 구성할 수 있는 커스텀 모듈을 쉽게 만들 수 있습니다. 자세한 내용은 [여기](https://docs.nestjs.com/fundamentals/dynamic-modules)를 참고하세요.

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection]
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers
    };
  }
}
```

> [!NOTE] HINT
> `forRoot()`는 동적 모듈을 동기, 비동기로 반환할 수 있습니다.

이 모듈은 기본적으로 `Connection provider`를 정의하지만 (`@Module()` 데코레이터 메타데이터에서), 추가로 `forRoot()`로 전달 되는 엔티티 및 옵션 객체에 따라 리포지토리와 같은 `provider` 컬랙션을 노출합니다. 동적 모듈이 반환하는 속성은 `@Module()` 데코레이터에 정의된 기본 모듈 메타데이터를 재정의 하지 않고 확장한다는 점에 유의하세요. 이것이 정적으로 선언된 `Connection provicer`와 동적으로 생성된 리포지토리 `provider`가 모듈에서 내보내는 방식입니다.

`DatabaseModule` 모듈은 다음과 같은 방법으로 가져오고 구성할 수 있습니다.

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule]
})
export class AppModule {}
```

동적 모듈을 차례로 다시 내보내려면 exports 배열에서 forRoot() 메서드 호출을 생략할 수 있습니다.
