---
title: TypeSafe한 ConfigModule
description: nest에서 Typescript를 이용한 Config 관리
image:
date: 2023-04-12T16:46:00
tags:
  - NestJS
  - 백엔드
type: Blog
slug: typesafe-config-module
---

이번에 nest를 사용하면서 환경변수를 관리하기 위해 @nestjs/config에서 제공하는 configModule을 사용했다.

## 간단한 사용법

```tsx
export const configuration = () => {
  const config = {
    port: Number(process.env.PORT) || 3000,
    db: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME
    },
    hash: {
      time: Number(process.env.HASH_TIME) || 10
    },
    jwt: {
      secert: process.env.JWT_SECRET
    }
  };

  return config;
};

ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration]
}),
  //예시

  this.configService.get('db.user');
```

## 문제점

ConfigService를 그냥 사용하기에는 두 가지 단점이 있다.

- 타입을 위해 제네릭을 수동으로 입력해야 한다
- get에 넘겨주는 인자의 타입이 string이다.

```tsx
this.configService.get('port'); // any

this.configService.get<number>('port'); // number
```

다음과 같이 개발자가 수동으로 제네릭을 넘겨 configService 타입을 맞춰줘야 한다.

또한 get에서 받는 인자의 타입이 string이기 때문에 개발자가 configService의 환경변수 키 값을 전부 알고 있어야한다.

타입 시스템을 사용하는 nest에서 이는 불편하다고 생각해 방법을 찾아봤다.

## 해결책

타입 시스템을 사용하기 위해 ConfigModule을 사용하는 새로운 TypeSafeConfigModule을 만들었다.

```tsx
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    })
  ],
  providers: [TypeSafeConfigService],
  exports: [TypeSafeConfigService]
})
export class TypeSafeConfigModule {}
```

AppModule에서 하던 것과 같이 TypeSafeConfigModule에서 ConfigModule을 import한다.

나는 만들어진 TypeSafeConfigModule을 글로벌 모듈로 사용할 거기 때문에 Global 데코레이터를 추가해 사용했다.

```tsx
@Injectable()
export class TypeSafeConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends Leaves<ENVConfiguration>>(propertyPath: T): LeafTypes<ENVConfiguration, T> {
    return this.configService.get(propertyPath);
  }
}
```

TypeSafeConfigService에서는 configService를 inject해 제네릭을 통해 get메서드를 한번 감싸 인자와 반환값에 타입을 추가했다.

중첩 객체에 키에 대한 값을 타입으로 사용하기 위해 다음 타입이 필요하다.

```tsx
export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;
```

이제 TypeSafeService를 사용하면 인자로 받는 키값도 자동완성이 가능하고 타입도 알아서 추론한다.

![](https://i.imgur.com/TjrWpKc.gif)

## 참고자료

[Typed ConfigService in NestJS](https://dev.to/hantaihe/typed-configservice-in-nestjs-1nml)
