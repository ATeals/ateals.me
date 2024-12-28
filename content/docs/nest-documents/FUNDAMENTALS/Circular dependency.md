---
title: Circular dependency
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-14T16:52

tags:
  - NestJS
  - 공식문서
series: nest-document
slug: circular-dependency
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/circular-dependency)

순환 종속성은 두 클래스가 서로 의존할 때 발생합니다. 예를 들어 클래스 A에는 클래스 B가 필요하고 클래스 B에도 클래스 A가 필요합니다. 네스트에서는 모듈 간 또는 공급자 간에 순환 종속성이 발생할 수 있습니다.

순환 종속성은 가능한 한 피해야 하지만 항상 그렇게 할 수는 없습니다. 이러한 경우 Nest에서는 두 가지 방법으로 공급자 간의 순환 종속성을 해결할 수 있습니다. 이 장에서는 한 가지 방법으로 **정방향 참조**를 사용하는 방법과 다른 방법으로 **ModuleRef** 클래스를 사용하여 DI 컨테이너에서 공급자 인스턴스를 검색하는 방법을 설명합니다.

또한 모듈 간의 순환 종속성을 해결하는 방법도 설명합니다.

> [!WARNING] WARNING
> "barrel files"/index.ts 을 사용하여 가져오기를 그룹화할 때 순환 종속성이 발생할 수도 있습니다. 모듈/프로바이더 클래스의 경우 배럴 파일을 생략해야 합니다. 예를 들어, 배럴 파일과 같은 디렉터리 내의 파일을 가져올 때는 배럴 파일을 사용해서는 안 됩니다. 즉, `cats/cats.controller`에서 `cats/cats.service` 파일을 가져오기 위해 cats를 가져와서는 안 됩니다. 자세한 내용은 [이 github 이슈](https://github.com/nestjs/nest/issues/1181#issuecomment-430197191)를 참조하세요.

## Forward reference[#](https://docs.nestjs.com/fundamentals/circular-dependency#forward-reference)

정방향 참조를 사용하면 Nest가 `forwardRef()` 유틸리티 함수를 사용하여 아직 정의되지 않은 클래스를 참조할 수 있습니다. 예를 들어 `CatsService`와 `CommonService`가 서로 의존하는 경우 관계의 양쪽에서 `@Inject()` 및 `forwardRef()` 유틸리티를 사용하여 순환 종속성을 해결할 수 있습니다. 그렇지 않으면 모든 필수 메타데이터를 사용할 수 없으므로 Nest에서 인스턴스화하지 않습니다. 다음은 예시입니다.

```typescript title="cats.service.ts"
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService
  ) {}
}
```

이는 관계의 한 측면을 다루었습니다. 이제 CommonService에 대해서도 똑같이 해보겠습니다.

```typescript title="common.service.ts"
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService
  ) {}
}
```

> [!WARNING] WARNING
> 인스턴스화 순서는 결정되지 않습니다. 코드가 어떤 생성자가 먼저 호출되는지에 따라 달라지지 않도록 하세요. `Scope.REQUEST`가 있는 공급자에 순환 종속성이 있으면 정의되지 않은 종속성이 발생할 수 있습니다. 자세한 내용은 [여기](https://github.com/nestjs/nest/issues/5778)에서 확인하세요.

## ModuleRef class alternative[#](https://docs.nestjs.com/fundamentals/circular-dependency#moduleref-class-alternative)

`forwardRef()`를 사용하는 대신 코드를 리팩터링하고 `ModuleRef` 클래스를 사용하여 순환 관계의 한쪽에서 공급자를 검색하는 방법도 있습니다. [여기](https://docs.nestjs.com/fundamentals/module-ref)에서 `ModuleRef` 유틸리티 클래스에 대해 자세히 알아보세요.

## Module forward reference[#](https://docs.nestjs.com/fundamentals/circular-dependency#module-forward-reference)

모듈 간의 순환 종속성을 해결하려면 모듈 연결의 양쪽에서 동일한 `forwardRef()` 유틸리티 함수를 사용하세요.

```typescript title="common.module.ts"
@Module({
  imports: [forwardRef(() => CatsModule)]
})
export class CommonModule {}
```

```typescript title="cats.module.ts"
@Module({
  imports: [forwardRef(() => CommonModule)]
})
export class CatsModule {}
```
