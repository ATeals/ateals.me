---
title: Pipes
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-05-29T19:22:00
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: pipes
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/pipes)

파이프는 `@Injectable()` 데코레이터로 주석이 달린 클래스로, `PipeTransform` 인터페이스를 구현합니다.

![](https://i.imgur.com/L5cMOyj.png)

파이프에는 두 가지 일반적인 사용 사례가 있습니다.

- **transformation**: 입력 데이터를 원하는 형태로 변환(예: 문자열에서 정수로)
- **validation**: 입력 데이터를 평가하고 유효하면 변경하지 않고 그대로 전달하고, 그렇지 않으면 예외를 던집니다.

두 경우 모두 파이프는 컨트롤러 라우트 핸들러가 처리 중인 `arguments`를 대상으로 작동합니다. Nest는 메서드가 호출되기 직전에 파이프를 삽입하고, 파이프는 메서드의 대상이 되는 인수를 받아 이를 대상으로 작동합니다. 이때 모든 변환 또는 유효성 검사 작업이 수행되고, 그 후에 (잠재적으로) 변환된 인수를 사용하여 [controller route handler](https://docs.nestjs.com/controllers#route-parameters)가 호출됩니다.

Nest에는 바로 사용할 수 있는 여러 가지 기본 제공 파이프가 있습니다. 사용자 정의 파이프를 직접 만들 수도 있습니다.

> [!NOTE] HINT
> 파이프는 예외 영역 내에서 실행됩니다. 즉, 파이프가 예외를 던지면 예외 계층(전역 예외 필터 및 현재 컨텍스트에 적용되는 모든 [exceptions filters](https://docs.nestjs.com/exception-filters))에서 처리됩니다. 위의 내용을 고려할 때, 파이프에서 예외가 발생하면 컨트롤러 메서드가 이후에 실행되지 않는다는 것을 분명히 알 수 있습니다. 이는 시스템 경계에서 외부 소스에서 애플리케이션으로 들어오는 데이터의 유효성을 검사하는 모범 사례 기법을 제공합니다.

## Built-in pipes[#](https://docs.nestjs.com/pipes#built-in-pipes)

Nest에는 9개의 파이프가 기본으로 제공됩니다.

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

## Binding pipes[#](https://docs.nestjs.com/pipes#binding-pipes)

파이프를 사용하려면 파이프 클래스의 인스턴스를 적절한 컨텍스트에 바인딩해야 합니다. `ParseIntPipe` 예제에서는 파이프를 특정 라우트 핸들러 메서드와 연결하고 메서드가 호출되기 전에 파이프가 실행되도록 하려고 합니다. 이를 위해 다음 구성을 사용하며, 이를 메서드 매개변수 수준에서 파이프를 바인딩하는 것으로 지칭합니다.

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

이렇게 하면 `findOne()` 메서드에서 받은 매개변수가 숫자(`this.catsService.findOne()` 호출에서 예상한 대로)이거나 라우트 핸들러가 호출되기 전에 예외가 발생하는 두 가지 조건 중 하나가 참인지 확인할 수 있습니다.

```bash
GET localhost:3000/abc
```

경로가 다음과 같이 호출된다고 가정할 때, Nest는 아래와 같은 예외를 발생시킵니다.

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

예외가 발생하면 `findOne()` 메서드의 본문이 실행되지 않습니다.

위의 예에서는 인스턴스가 아닌 클래스(`ParseIntPipe`)를 전달하여 인스턴스화에 대한 책임을 프레임워크에 맡기고 의존성 주입을 가능하게 합니다. 파이프 및 가드와 마찬가지로, 대신 제자리에 있는 인스턴스를 전달할 수 있습니다. 제자리 인스턴스 전달은 옵션을 전달하여 내장된 파이프의 동작을 사용자 정의하려는 경우에 유용합니다.

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

다른 변환 파이프(모든 `Parse*` 파이프)를 바인딩하는 것도 비슷하게 작동합니다. 이러한 파이프는 모두 경로 매개변수, 쿼리 문자열 매개변수 및 요청 본문 값의 유효성을 검사하는 컨텍스트에서 작동합니다.

예를 들어 쿼리 문자열 매개변수가 있습니다.

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

다음은 문자열 매개변수를 구문 분석하고 UUID인지 확인하는 `ParseUUIDPipe`의 예제입니다.

```typescript

@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

> [!NOTE] HINT
> 3, 4 또는 5 버전의 UUID를 구문 분석하는 경우, 특정 버전의 UUID만 필요한 경우 파이프 옵션에 버전을 전달할 수 있습니다.

위에서 다양한 `Parse*` 내장 파이프 제품군을 바인딩하는 예제를 살펴봤습니다. 유효성 검사 파이프를 바인딩하는 것은 조금 다르므로 다음 섹션에서 이에 대해 설명하겠습니다.

> [!NOTE] HINT
> 또한 유효성 검사 파이프의 광범위한 예는  [Validation techniques](https://docs.nestjs.com/techniques/validation)을 참조하세요.

## Custom pipes[#](https://docs.nestjs.com/pipes#custom-pipes)

앞서 언급했듯이 사용자 정의 파이프를 직접 만들 수 있습니다. Nest는 강력한 기본 제공 `ParseIntPipe` 및 `ValidationPipe`를 제공하지만, 사용자 정의 파이프가 어떻게 구성되는지 알아보기 위해 각각의 간단한 사용자 정의 버전을 처음부터 구축해 보겠습니다.

간단한 `ValidationPipe`부터 시작하겠습니다. 처음에는 단순히 입력값을 받아 즉시 동일한 값을 반환하여 ID 함수처럼 동작하도록 하겠습니다.

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

> [!NOTE] HINT
> `PipeTransform<T, R>`은 모든 파이프에서 구현해야 하는 일반 인터페이스입니다. 이 일반 인터페이스는 `T`를 사용하여 입력 값의 유형을 나타내고 `R`을 사용하여 `transform()` 메서드의 반환 유형을 나타냅니다.

모든 파이프는 `PipeTransform` 인터페이스를 이용해 `transform()` 메서드를 구현해야 합니다. 이 메서드에는 두 개의 매개변수가 있습니다.

- `value`
- `metadata`

`value` 매개변수는 현재 처리된 메소드 인자(경로 처리 메소드에서 수신하기 전)이며, `metadata`는 현재 처리된 메소드 인자의 메타데이터입니다. 메타데이터 객체에는 이러한 속성이 있습니다.

```typescript
export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom";
  metatype?: Type<unknown>;
  data?: string;
}
```

|            |                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`     | 인수가 `@Body()`, `@Query()`, `@Param()` 또는 사용자 지정 매개변수인지 여부를 나타냅니다(자세한 내용은 [여기](https://docs.nestjs.com/custom-decorators)를 참조하세요). |
| `metatype` | 인수의 메타타입(예: `String`)을 제공합니다. 참고: 라우트 핸들러 메서드 서명에서 타입 선언을 생략하거나 바닐라 JavaScript를 사용하는 경우 이 값은 `undefined`입니다.     |
| `data`     | 데코레이터에 전달된 문자열(예: `@Body('String')`). 데코레이터 괄호를 비워두면 `undefined` 입니다.                                                                       |

> [!WARNING] WARNING
> TypeScript 인터페이스는 트랜스파일링 중에 사라집니다. 따라서 메서드 매개변수의 유형이 클래스 대신 인터페이스로 선언된 경우 `metatype` 값은 `Object`가 됩니다.

``

## Schema based validation[#](https://docs.nestjs.com/pipes#schema-based-validation)

유효성 검사 파이프를 좀 더 유용하게 만들어 봅시다. 서비스 메서드를 실행하기 전에 포스트 본문 객체가 유효한지 확인해야 하는 `CatsController`의 `create()` 메서드를 자세히 살펴봅시다.

```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

`CreateCatDto` 본문 매개변수를 집중적으로 살펴봅시다. 이 매개변수의 유형은 `CreateCatDto`입니다.

```typescript
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

create 메서드로 들어오는 모든 요청에 유효한 본문이 포함되어 있는지 확인하고자 합니다. 따라서 `createCatDto` 객체의 세 멤버의 유효성을 검사해야 합니다. 라우트 핸들러 메서드 내부에서 이 작업을 수행할 수 있지만 **단일 책임 원칙(SRP)** 을 위반하므로 이상적이지 않습니다.

또 다른 접근 방식은 **validator class**를 생성하고 거기서 작업을 위임하는 것입니다. 이 방법은 각 메서드의 시작 부분에서 이 validator를 호출하는 것을 기억해야 한다는 단점이 있습니다.

유효성 검사 미들웨어를 만드는 것은 어떨까요? 이 방법도 효과가 있을 수 있지만 안타깝게도 전체 애플리케이션의 모든 컨텍스트에서 사용할 수 있는 **generic middleware**를 만드는 것은 불가능합니다. 미들웨어는 호출될 핸들러와 그 매개변수 등 **실행 컨텍스트**를 인식하지 못하기 때문입니다.

물론 이것이 바로 파이프가 설계된 사용 사례입니다. 이제 유효성 검사 파이프를 구체화해 보겠습니다.

## Object schema validation[#](https://docs.nestjs.com/pipes#object-schema-validation)

깔끔하고 **DRY**한 방식으로 객체 유효성 검사를 수행하는 데 사용할 수 있는 몇 가지 접근 방식이 있습니다. 한 가지 일반적인 접근 방식은 스키마 기반 유효성 검사를 사용하는 것입니다. 이 접근 방식을 사용해 보겠습니다.

`Zod` 라이브러리를 사용하면 읽기 쉬운 API를 사용하여 간단한 방식으로 스키마를 만들 수 있습니다. `Zod` 기반 스키마를 사용하는 유효성 검사 파이프를 구축해 보겠습니다.

아래 코드 샘플에서는 스키마를 생성자 인수로 사용하는 간단한 클래스를 만듭니다. 그런 다음 제공된 스키마에 대해 들어오는 인수의 유효성을 검사하는 `schema.parse()` 메서드를 적용합니다.

앞서 언급했듯이 **validation pipe**는 변경되지 않은 값을 반환하거나 예외를 던집니다.

다음 섹션에서는 `@UsePipes()` 데코레이터를 사용하여 주어진 컨트롤러 메서드에 적절한 스키마를 제공하는 방법을 살펴보겠습니다. 이렇게 하면 의도한 대로 여러 컨텍스트에서 유효성 검사 파이프를 재사용할 수 있습니다.

```typescript
import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException("Validation failed");
    }
  }
}
```

## Binding validation pipes[#](https://docs.nestjs.com/pipes#binding-validation-pipes)

앞서 변환 파이프를 바인딩하는 방법(예: `ParseIntPipe` 및 나머지 `Parse*` 파이프)을 살펴봤습니다.

validation pipes 를 바인딩하는 방법도 매우 간단합니다.

이 경우 메서드 호출 수준에서 파이프를 바인딩하고자 합니다. 현재 예제에서는 `ZodValidationPipe`를 사용하려면 다음을 수행해야 합니다.

1. ZodValidationPipe의 인스턴스를 생성합니다.
2. 파이프의 클래스 생성자에 컨텍스트별 Zod 스키마를 전달합니다.
3. 파이프를 메서드에 바인딩합니다.

```typescript
import { z } from "zod";

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

```typescript
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

> [!WARNING] WARNING
> `zod` 라이브러리를 사용하려면 `tsconfig.json` 파일에서 `strictNullChecks` 구성을 사용하도록 설정해야 합니다.

## Class validator[#](https://docs.nestjs.com/pipes#class-validator)


> [!WARNING] WARNING
> 이 섹션의 기술은 타입스크립트가 필요하며 바닐라 자바스크립트를 사용하여 앱을 작성하는 경우 사용할 수 없습니다.

유효성 검사 기술에 대한 다른 구현 방법을 살펴보겠습니다.

Nest는 `class-validator` 라이브러리와 잘 작동합니다. 이 강력한 라이브러리를 사용하면 데코레이터 기반 유효성 검사를 사용할 수 있습니다. `decorator-based validation`는 특히 처리된 프로퍼티의 `metatype` 액세스할 수 있기 때문에 Nest의 파이프 기능과 결합하면 매우 강력합니다.

`CreateCatDto` 클래스에 몇 가지 데코레이터를 추가할 수 있습니다. 이 기법의 중요한 장점은 별도의 유효성 검사 클래스를 만들 필요 없이 `CreateCatDto` 클래스가 Post 본문 객체에 대한 **단일 소스**로 유지된다는 점입니다.

```typescript
import { IsString, IsInt } from "class-validator";

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

> [!NOTE] HINT
> [여기](https://github.com/typestack/class-validator#usage)에서 `class-validator` 데코레이터에 대해 자세히 알아보세요.

이제 이러한 어노테이션을 사용하는 `ValidationPipe` 클래스를 만들 수 있습니다.

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

> [!NOTE] HINT
> 다시 한 번 말씀드리자면, `ValidationPipe`는 Nest에서 기본으로 제공되므로 일반적인 유효성 검사 파이프를 직접 구축할 필요가 없습니다. 기본 제공 `ValidationPipe`는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공하지만, 사용자 정의 파이프의 메커니즘을 설명하기 위해 기본으로 유지했습니다. [여기](https://docs.nestjs.com/techniques/validation)에서 많은 예제와 함께 자세한 내용을 확인할 수 있습니다.

> [!WARNING] WARNING
> 위의  [class-transformer](https://github.com/typestack/class-transformer) 라이브러리는 **class-validator** 라이브러리와 같은 작성자가 만든 것으로, 결과적으로 두 라이브러리는 매우 잘 어울립니다.

이 코드를 살펴봅시다. 먼저 `transform()` 메서드가 비동기로 표시되어 있다는 점에 주목하세요. 이는 Nest가 동기 및 비동기 파이프를 모두 지원하기 때문에 가능합니다. 이 메서드를 비동기로 만든 이유는 class-validator 중 일부가 비동기적일 수 있기 때문입니다(프로미스 활용).

다음으로 `metatype` 필드를 메타타입 매개변수로 추출하기 위해 구조 파괴를 사용하고 있습니다(`ArgumentMetadata`에서 이 멤버만 추출). 이것은 전체 `ArgumentMetadata`를 가져온 다음 메타타입 변수를 할당하기 위한 추가 문을 만드는 것을 줄인 것입니다.

다음으로 도우미 함수 `toValidate()`를 주목하세요. 이 함수는 현재 처리 중인 인수가 네이티브 JavaScript 유형일 때 유효성 검사 단계를 우회하는 역할을 합니다(이 경우 유효성 검사 데코레이터를 첨부할 수 없으므로 유효성 검사 단계를 거칠 이유가 없습니다).

다음으로, 유효성 검사를 적용할 수 있도록 클래스 변환기 함수인 `plainToInstance()`를 사용하여 일반 JavaScript 인수 객체를 유형이 지정된 객체로 변환합니다. 이 작업을 수행해야 하는 이유는 네트워크 요청에서 역직렬화된 수신 포스트 본문 객체에는 유형 정보가 없기 때문입니다(Express와 같은 기본 플랫폼이 작동하는 방식입니다). 클래스 유효성 검사기는 앞서 DTO에 대해 정의한 유효성 검사 데코레이터를 사용해야 하므로 이 변환을 수행하여 수신 본문을 단순한 바닐라 객체가 아닌 적절하게 데코레이션된 객체로 처리해야 합니다.

마지막으로 앞서 언급했듯이 **validation pipe**이므로 값을 변경하지 않고 반환하거나 예외를 던집니다.

마지막 단계는 `ValidationPipe`를 바인딩하는 것입니다. 파이프는 매개변수 범위, 메서드 범위, 컨트롤러 범위 또는 전역 범위가 될 수 있습니다. 앞서 `Zod` 기반 유효성 검사 파이프를 사용하여 메서드 수준에서 파이프를 바인딩하는 예제를 살펴봤습니다. 아래 예제에서는 파이프 인스턴스를 라우트 핸들러 `@Body()` 데코레이터에 바인딩하여 파이프가 호출되어 포스트 본문의 유효성을 검사하도록 하겠습니다.

```typescript

@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```

매개변수 범위 지정 파이프는 유효성 검사 로직이 지정된 매개변수 하나에만 관련될 때 유용합니다.

## Global scoped pipes[#](https://docs.nestjs.com/pipes#global-scoped-pipes)

`ValidationPipe`는 최대한 범용적으로 만들어졌기 때문에 전체 애플리케이션의 모든 경로 핸들러에 적용되도록 **전역 범위** 파이프로 설정하면 그 유용성을 최대한 발휘할 수 있습니다.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

> [!WARNING] WARNING
> 하이브리드 앱의 경우 `useGlobalPipes()` 메서드는 게이트웨이 및 마이크로 서비스에 대한 파이프를 설정하지 않습니다. "표준"(비하이브리드) 마이크로서비스 앱의 경우, `useGlobalPipes()`는 파이프를 전역적으로 마운트합니다.

글로벌 파이프는 전체 애플리케이션에서 모든 컨트롤러와 모든 라우트 핸들러에 사용됩니다.

종속성 주입과 관련하여 모듈 외부에서 등록된 글로벌 파이프(위 예제에서와 같이 `useGlobalPipes()`를 사용하여)는 바인딩이 모듈의 컨텍스트 외부에서 이루어졌기 때문에 종속성을 주입할 수 없다는 점에 유의하세요. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 전역 파이프를 설정할 수 있습니다:

```typescript
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

> [!NOTE] HINT
> 이 접근 방식을 사용하여 파이프에 대한 종속성 주입을 수행할 때 이 구조가 사용되는 모듈에 관계없이 파이프는 실제로 전역이라는 점에 유의하세요. 이 작업을 어디에서 수행해야 할까요? 파이프가 정의된 모듈(위 예제에서는 `ValidationPipe`)을 선택합니다. 또한 사용 클래스만이 custom provider 등록을 처리하는 유일한 방법은 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

## The built-in ValidationPipe[#](https://docs.nestjs.com/pipes#the-built-in-validationpipe)

다시 한 번 말씀드리지만, `ValidationPipe`는 Nest에서 기본으로 제공되므로 일반적인 유효성 검사 파이프를 직접 구축할 필요가 없습니다. 기본 제공 `ValidationPipe`는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공하지만, 사용자 정의 파이프의 메커니즘을 설명하기 위해 기본으로 유지했습니다. [여기](https://docs.nestjs.com/techniques/validation)에서 많은 예제와 함께 자세한 내용을 확인할 수 있습니다.

## Transformation use case[#](https://docs.nestjs.com/pipes#transformation-use-case)

유효성 검사만이 사용자 정의 파이프의 유일한 사용 사례는 아닙니다. 이 장의 서두에서 파이프로 입력 데이터를 원하는 형식으로 변환할 수도 있다고 언급했습니다. 이는 `transform` 함수에서 반환된 값이 인수의 이전 값을 완전히 재정의하기 때문에 가능합니다.

언제 유용할까요? 클라이언트에서 전달된 데이터가 라우트 핸들러 메서드에서 제대로 처리되기 전에 문자열을 정수로 변환하는 등 일부 변경을 거쳐야 하는 경우가 있습니다. 또한 일부 필수 데이터 필드가 누락되어 기본값을 적용하고자 할 수도 있습니다. **Transformation pipes**는 클라이언트 요청과 요청 핸들러 사이에 처리 함수를 삽입하여 이러한 기능을 수행할 수 있습니다.

다음은 문자열을 정수 값으로 구문 분석하는 간단한 `ParseIntPipe`입니다. (위에서 언급했듯이 Nest에는 더 정교한 `ParseIntPipe`가 내장되어 있으며, 사용자 정의 변환 파이프의 간단한 예로 포함시켰습니다).

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException("Validation failed");
    }
    return val;
  }
}
```

또 다른 유용한 변환 사례는 요청에 제공된 ID를 사용하여 데이터베이스에서 기존 사용자 엔티티를 선택하는 것입니다.

```typescript
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}
```

이 파이프의 구현은 독자에게 맡기지만 다른 모든 변환 파이프와 마찬가지로 입력 값(`ID`)을 받고 출력 값(`UserEntity` 개체)을 반환한다는 점에 유의하세요. 이렇게 하면 보일러플레이트 코드를 핸들러에서 공통 파이프로 추상화하여 코드를 보다 선언적이고 `DRY`하게 만들 수 있습니다.

## Providing defaults[#](https://docs.nestjs.com/pipes#providing-defaults)

`Parse*` 파이프는 매개변수 값이 정의되어 있을 것으로 기대합니다. `null` 또는 `undefined`를 수신하면 예외를 발생시킵니다. 엔드포인트에서 누락된 쿼리 문자열 매개변수 값을 처리할 수 있도록 하려면, `Parse*` 파이프가 이러한 값에 대해 작동하기 전에 주입할 기본값을 제공해야 합니다. `DefaultValuePipe`가 바로 그 역할을 합니다. 아래 그림과 같이 관련 `Parse*` 파이프 앞에 `@Query()` 데코레이터에서 `DefaultValuePipe`를 인스턴스화하기만 하면 됩니다.

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```
