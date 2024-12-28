---
title: Prisma를 사용해 Repository 패턴을 구현하면서
description: Prisma 채택 과정과 우당탕탕 개발기
image: https://i.imgur.com/G6fHudY.jpeg
date: 2024-06-17T19:02
tags:
  - NestJS
  - ORM
  - prisma
slug: prisma-repository
---

최근에 Nest를 공부할겸 새로운 프로젝트를 시작했습니다. ORM을 선택하는 과정에서 기본 예시인 TypeORM말고 Prisma를 선택하게 되었는데 이 과정을 기록하고자 합니다.

## What is Prisma ORM?

prisma가 무엇일까요? 공식문서에서는 다음과 같이 prisma를 설명합니다.

> 프리즈마 ORM은 오픈소스 차세대 ORM입니다. 다음과 같은 부분으로 구성되어 있습니다:
>
> - **Prisma Client**: Node.js 및 TypeScript용 자동 생성 및 유형 안전 쿼리 빌더
> - **Prisma Migrate**: 마이그레이션 시스템
> - **Prisma Studio**: GUI를 사용한 데이터베이스의 데이터 편집기

prisma는 REST API, GraphQL API, gRPC API 또는 데이터베이스가 필요한 모든 Node.js(지원되는 버전) 또는 TypeScript 백엔드 서비스에서 사용할 수 있습니다.

## Why Prisma ORM?

[공식문서](https://www.prisma.io/docs/orm/overview/prisma-in-your-stack/is-prisma-an-orm#how-prisma-orm-implements-the-data-mapper-pattern)에 따르면 prisma는 기존 ORM과 근본적으로 다른 새로운 종류의 ORM입니다.

기존 ORM은 코드의 모델 클래스에 테이블을 매핑하여 관계형 데이터베이스로 작업할 수 있는 객체 지향 방식을 제공합니다. 이 접근 방식은 객체-관계형 임피던스 불일치로 인해 발생하는 많은 문제들을 야기합니다.

> [!NOTE] HINT
> 임피던스 불일치에 대한 추가적인 내용은 [여기](https://ko.linux-console.net/?p=7583)를 참조하세요.

prisma는 전통적인 ORM과는 다른 방식으로 작동합니다. prisma에서는 데이터베이스 스키마와 프로그래밍 소스의 모델에 대한 `Single source of truth`역할을 하는 선언적인 `prisma.schema`에서 모델을 정의할 수 있습니다. 그러면 애플리케이션 코드에서 복잡한 모델 인스턴스를 관리해야하는 오버헤드 없이 prisma 클라이언트를 사용하여 데이터베이스의 데이터를 `type-safe`한 방식으로 읽고 쓸 수 있습니다. prisma client는 항상 일반 JavaScript 객체를 반환하므로 데이터 쿼리 프로세스가 훨씬 더 자연스러워지고 예측 가능성도 높아집니다.

제가 TypeORM을 사용하지 않고 prisma를 선택한 이유는 다음과 같습니다.

- 보다 더 나은 타입 안정성
- `prisma.schema`를 통한 `Single source of truth`
- 빠르게 확인하기 편한 `prisma studio`
- `REST API`, `GraphQL API`, `gRPC API` 와 같은 여러 환경의 지원

### TypeORM과 Prisma의 type-safe

기본적으로 TypeORM도 일정 수준에 대한 type-safe를 보장합니다. 하지만 부족한 상황도 많습니다. 공식문서에 나오는 예시를 통해 알아보겠습니다.

```ts title="typeorm"
const postRepository = getManager().getRepository(Post);

const publishedPosts: Post[] = await postRepository.find({
  where: { published: true },
  select: ['id', 'title']
});
```

TypeORM을 사용해 반환된 Post 배열의 각 객체는 런타임 환경에서 select에 전달된 `'id'`, `'title'` 속성만 전달하지만 TypeScript 컴파일러는 이에 대해 추론할 수 없습니다. 예를 들어 다음과 같이 쿼리 이후 Post 엔티티에 정의된 다른 프로퍼티에 접근할 수 있습니다.

```ts
const post = publishedPosts[0];

// 타입스크립트 컴파일러는 post.content접근에 대한 오류를 반환하지 않습니다.
if (post.content.length > 0) {
  console.log(`This post has some content.`);
}
```

이 코드는 물론 런타임에 에러를 던집니다.

```zsh
TypeError: Cannot read property 'length' of undefined
```

이에 반해 prisma는 동일한 상황에서 완전한 `type-safe`를 보장하고 DB에서 검색되지 않은 필드에 접근하지 못하도록 보호합니다.

```ts
const publishedPosts = await prisma.post.findMany({
  where: { published: true },
  select: {
    id: true,
    title: true
  }
});

const post = publishedPosts[0];

// 타입스크립트 컴파일러는 post.content 접근을 허용하지 않습니다.
if (post.content.length > 0) {
  console.log(`This post has some content.`);
}
```

이 경우 컴파일러는 컴파일 타임에 오류를 발생시킵니다.

```zsh
[ERROR] 14:03:39 ⨯ Unable to compile TypeScript:
src/index.ts:36:12 - error TS2339: Property 'content' does not exist on type '{ id: number; title: string; }'.

42   if (post.content.length > 0) {
```

## Nest와 prisma

Nest에서는 기본 예제로 계층형 아키텍처를 통해 백엔드 서비스를 만듭니다. 계층형 아키텍처에서 db에 접근하기 위해 repository layer를 통해 책임을 분배할 수 있습니다.

이에 따라 prisma service를 Nest에서 사용하는 방법을 두가지로 나누어 봤습니다.

- prisma module을 통해 모든 db 접근에 대해 prisma service에서 모두 관리한다.
- 각 도메인 (`Users`, `Posts`와 같은)에 각각 repository providers를 통해 prisma service에 접근해 관리한다.

제가 배운 Nest 강의에서는 기본적으로 TypeORM을 사용했기 때문에 repository를 통해 db에 접근 했고, 다른 ORM으로의 마이그레이션 가능성과 계층 분리로 인한 책임 분배를 이유로 후자의 방법을 통해 prisma를 사용하고자 repository layer를 구현하고자 했습니다.

### Prisma Service

Prisma Providers를 만드는 예시는 [공식문서](https://docs.nestjs.com/recipes/prisma#prisma)에 자세히 나와있습니다.

```ts title="prisma.module.ts"
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

저는 PrismaModule을 전역으로 사용하기 위해 `@Global()` 데코레이터를 사용했습니다.

제공된 PrismaService를 통해 도메인의 Repository를 만드는 가장 쉬운 방법은 생성자로 전달받은 PrismaService의 메서드를 전부 구현하는 방법입니다.

```ts
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateArgs) {
    return this.prisma.user.create(data);
  }

  async findMany(data: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(data);
  }

  async findUnique(data: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(data);
  }

  async update(data: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(data);
  }

  async delete(data: Prisma.UserDeleteArgs) {
    return this.prisma.user.delete(data);
  }
}
```

이 방법은 매우 더럽습니다. 각 도메인의 repository는 같은 역할을 하기 때문에 코드가 중복될 가능성이 높습니다. 게으른 개발자는 이를 극도로 참지 못하며 repository를 구현할 때마다 TypeORM이 그리워질 가능성이 현저히 높아집니다.

따라서 각 repository에서 상속할 수 있는 PrismaRepository Class를 만들었습니다.

## Generic PrismaRepository Class

prisma에서 repository pattern을 사용하기 위한 시도는 일반적입니다. 이에 대한 이슈는 쉽게 [공식문서](https://github.com/prisma/prisma/discussions/10584)에서 찾아볼 수 있습니다.

> 참고한 이슈는 [여기](https://github.com/prisma/prisma/issues/5273)를 참고해주세요.

이슈에서 가장 매력적이라고 생각한 [코드](https://github.com/prisma/prisma/issues/5273#issuecomment-767453556)를 보면 아쉽게도 문제점이 존재합니다.

PrismaClient가 제공하는 타입체크를 위해 개발자는 해당 도메인의 타입들을 인터페이스로 제공해야 합니다. 이는 도메인마다 repository를 위한 타입값을 제공해줘야 하기 때문에 번거롭고 개발자의 실수를 유발할 수 있습니다.

다음으로 PrismaRepository 메서드의 반환 타입이 제대로 추론되지 않고 `unknown`타입으로 추론된다는 점입니다.

위의 문제점들을 보완한 `Generic PrismaRepository Class`를 만들도록 하겠습니다.

```ts title="prisma.repository.ts"
export interface PrismaDelegate {
  aggregate(data: any): any;
  count(data: any): any;
  create(data: any): any;
  delete(data: any): any;
  deleteMany(data: any): any;
  findFirst(data: any): any;
  findMany(data: any): any;
  findUnique(data: any): any;
  update(data: any): any;
  updateMany(data: any): any;
  upsert(data: any): any;
}
```

먼저 Prisma에서 제공하는 메서드를 가진 인터페이스를 선언합니다.

이후 PrismaDelegate를 구현하는 PrismaRepository class를 선언합니다.

```ts title="prisma.repository.ts"
export class PrismaRepository<D extends PrismaDelegate> implements PrismaDelegate {
  constructor(protected delegate: D) {}

  public getDelegate(): D {
    return this.delegate;
  }

  aggregate(data: Parameters<D['aggregate']>[0]): ReturnType<D['aggregate']> {
    return this.getDelegate().aggregate(data);
  }

  count(data: Parameters<D['count']>[0]): ReturnType<D['count']> {
    return this.getDelegate().count(data);
  }

  create(data: Parameters<D['create']>[0]): ReturnType<D['create']> {
    return this.getDelegate().create(data);
  }

  delete(data: Parameters<D['delete']>[0]): ReturnType<D['delete']> {
    return this.getDelegate().delete(data);
  }

  deleteMany(data: Parameters<D['deleteMany']>[0]): ReturnType<D['deleteMany']> {
    return this.getDelegate().deleteMany(data);
  }

  findFirst(data: Parameters<D['findFirst']>[0]): ReturnType<D['findFirst']> {
    return this.getDelegate().findFirst(data);
  }

  findMany(data: Parameters<D['findMany']>[0]): ReturnType<D['findMany']> {
    return this.getDelegate().findMany(data);
  }

  findUnique(data: Parameters<D['findUnique']>[0]): ReturnType<D['findUnique']> {
    return this.getDelegate().findUnique(data);
  }

  update(data: Parameters<D['update']>[0]): ReturnType<D['update']> {
    return this.getDelegate().update(data);
  }

  updateMany(data: Parameters<D['updateMany']>[0]): ReturnType<D['updateMany']> {
    return this.getDelegate().updateMany(data);
  }

  upsert(data: Parameters<D['upsert']>[0]): ReturnType<D['upsert']> {
    return this.getDelegate().upsert(data);
  }
}
```

이제 repository가 필요한 부분에서 `PrismaRepository class`를 상속하면 됩니다. `PrismaRepository`의 제네릭인 `PrismaDelegate`는 `PrismaClient`에서 제공하는 타입을 사용하면 됩니다.

```ts title="users.repository.ts"
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends PrismaRepository<Prisma.UserDelegate> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  async findByEmail(email: string) {
    return this.findFirst({
      where: {
        email
      }
    });
  }
}
```

물론 커스텀 메서드가 필요하다면 `user.repository.ts`의 예시와 같이 추가적인 메서드를 선언할 수 있습니다.

`PrismaRepository class`를 통해 개발자는 보다 간편하게 repository providers를 선언할 있습니다. 이는 다음과 같은 장점이 있습니다.

- prisma가 제공하는 방식과 같이 완전 `type-safe` 합니다.
- 개발자는 추가적인 코드 없이 prisma에서 제공하는 Delegate를 통해 각각의 `repository providers`를 선언하고 사용할 수 있습니다.
- `prisma.schema`를 통한 장점인 `Single source of truth`를 최대한 유지할 수 있습니다.

## 결론

prisma를 통해 reository layer를 구현하면서 오늘도 게으른 개발자에 한걸음 다가갈 수 있었습니다.
