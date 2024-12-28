---
title: Providers
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-28T17:21:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: providers
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/providers)

프로바이더는 Nest의 기본 개념입니다. 서비스, 리포지토리, 팩토리, 헬퍼 등 많은 기본 Nest 클래스가 프로바이더로 취급될 수 있습니다. 프로바이더의 주요 개념은 종속성으로 `주입 (injected)`할 수 있다는 것입니다. 즉, 객체가 서로 다양한 관계를 생성할 수 있으며 이러한 객체를 주입하는 기능은 대부분 Nest 런타임 시스템에 위임할 수 있습니다.

![](https://i.imgur.com/4rZTS4h.png)

컨트롤러는 HTTP 요청을 처리하고 더 복잡한 작업을 **providers**에 위임해야 합니다. **providers**는 모듈에서 **providers**로 선언되는 일반 자바스크립트 클래스입니다.

> [!NOTE] HINT
> Nest를 사용하면 종속성을 보다 OO한 방식으로 설계, 구성할 수 있으므로 SOLID 원칙을 따르는 것을 적극 권장합니다.

## Services[#](https://docs.nestjs.com/providers#services)

유일한 새로운 기능은 `@Injectable()` 데코레이터를 사용한다는 것입니다. `Injectable()` 데코레이터는 메타데이터를 첨부하여 `CatsService`가 Nest IoC 컨테이너에서 관리할 수 있는 클래스임을 선언합니다.

```typescript
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

이제 컨트롤러 내부에서 해당 서비스를 사용하겠습니다.

```typescript
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

서비스는 클래스 생성자를 통해 `주입`됩니다. 비공개 구문을 사용하는 것을 주목하세요. 이 축약어를 사용하면 같은 위치에서 서비스 멤버를 즉시 선언하고 초기화 할 수 있습니다.

## Dependency injection[#](https://docs.nestjs.com/providers#dependency-injection)

Nest는 일반적으로 `의존성 주입`이라고 알려진 강력한 디자인 패턴을 기반으로 구축되었습니다.

Nest에서는 타입스크립트 기능 덕분에 종속성을 타입으로만 해결하기 때문에 종속성을 매우 쉽게 관리할 수 있습니다. 아래 예제에서 Nest는 CatsService의 인스턴스를 생성하고 반환함으로써(또는 싱글톤의 일반적인 경우 다른 곳에서 이미 요청된 경우 기존 인스턴스를 반환함으로써) catsService를 해결합니다.

## Scopes[#](https://docs.nestjs.com/providers#scopes)

프로바이더는 일반적으로 애플리케이션 수명 주기와 동기화된 `수명(범위)`을 가집니다. 애플리케이션이 부트스트랩되면 모든 종속성이 해결되어야 하므로 모든 프로바이더가 인스턴스화되어야 합니다. 마찬가지로 애플리케이션이 종료되면 각 공급자는 삭제됩니다. 하지만 평생 요청 범위를 설정하는 방법도 있습니다. [여기](https://docs.nestjs.com/fundamentals/injection-scopes)

## Custom providers[#](https://docs.nestjs.com/providers#custom-providers)

Nest에는 공급자 간의 관계를 해결하는 제어의 역전("IoC") 컨테이너가 내장되어 있습니다.

이 기능은 위에서 설명한 의존성 주입 기능의 기반이 되지만, 사실 지금까지 설명한 것보다 훨씬 더 강력합니다. 공급자를 정의하는 방법에는 일반 값, 클래스, 비동기 또는 동기 팩토리를 사용할 수 있는 여러 가지가 있습니다. 더 많은 예제가 여기에 제공됩니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)

## Optional providers[#](https://docs.nestjs.com/providers#optional-providers)

때로는 반드시 해결해야 할 필요가 없는 종속성이 있을 수 있습니다. 예를 들어 클래스가 구성 객체에 종속되어 있지만 아무 것도 전달되지 않으면 기본값을 사용해야 할 수 있습니다. 이러한 경우 구성 공급자가 없어도 오류가 발생하지 않으므로 종속성은 선택 사항이 됩니다.

공급자가 선택 사항임을 나타내려면 생성자에서 `@Optional()` 데코레이터를 사용합니다.

```typescript
@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

## Property-based injection[#](https://docs.nestjs.com/providers#property-based-injection)

지금까지 사용한 기술은 생성자 메서드를 통해 프로바이더를 주입하기 때문에 생성자 기반 주입이라고 합니다. 매우 특정한 경우에는 `프로퍼티 기반 주입`이 유용할 수 있습니다. 예를 들어 최상위 클래스가 하나 또는 여러 개의 프로바이더에 의존하는 경우 생성자에서 하위 클래스에서 `super()`를 호출하여 모든 프로바이더를 전달하는 것은 매우 지루할 수 있습니다. 이를 방지하기 위해 속성 수준에서 `@Inject()` 데코레이터를 사용할 수 있습니다.

```typescript
@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

> [!Warning] WARNING
>
> 클래스가 다른 클래스를 확장하지 않는 경우에는 항상 **constructor-based** 주입을 사용하는 것을 선호해야 합니다. 생성자는 필요한 종속성을 명시적으로 설명하며 `@Inject`로 주석 처리된 클래스 어트리뷰트보다 더 나은 가시성을 제공합니다.

## Provider registration[#](https://docs.nestjs.com/providers#provider-registration)

이제 서비스를 Nest에 등록하여 주입을 수행할 수 있도록 해야 합니다.

@Module() 데코레이터의 `providers` 배열에 서비스를 추가하여 이를 수행합니다.

## Manual instantiation[#](https://docs.nestjs.com/providers#manual-instantiation)

지금까지 Nest가 종속성 해결을 위한 대부분의 세부 사항을 자동으로 처리하는 방법에 대해 설명했습니다. 특정 상황에서는 기본 제공 종속성 주입 시스템에서 벗어나 수동으로 공급자를 검색하거나 인스턴스화해야 할 수도 있습니다. 아래에서 이러한 두 가지 주제에 대해 간략하게 설명합니다.

기존 인스턴스를 가져오거나 공급자를 동적으로 인스턴스화하려면 [모듈 참조](https://docs.nestjs.com/fundamentals/module-ref)를 사용할 수 있습니다.

부트스트랩() 함수 내에서 공급자를 가져오려면(예: 컨트롤러가 없는 독립형 애플리케이션 또는 부트스트랩 중 구성 서비스를 활용하려면) [독립형 애플리케이션](https://docs.nestjs.com/standalone-applications)을 참조하세요.
