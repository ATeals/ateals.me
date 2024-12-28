---
title: Prisma를 위한 Transaction Interceptor 구현
description: ...
image:
date: 2024-07-11T19:38
tags:
  - NestJS
  - prisma
slug: prisma-transaction-interceptor
---

트랜잭션은 데이터 베이스에서 중요한 요소입니다.

트랜잭션을 쉽게 이야기하자면 `한꺼번에 수행되어야 할 연산들`이라고 볼 수 있습니다.

해당 연선들 중 하나라도 실패하면 작업을 복구하고 전부 성공해야 작업을 데이터베이스에 적용합니다.

트랜잭션이 필요한 예시로 가장 많이 언급되는 것은 송금 서비스가 있습니다.

- A의 잔고를 불러옵니다.
- 읽은 A의 잔고에서 10000원을 인출합니다.
- B의 잔고를 읽어옵니다.
- 읽은 B의 잔고에 10000원을 입금합니다.
- 이를 데이터베이스에 기록합니다.

송금 서비스에서 인출과 입금 중 하나라도 실패하면 에러를 반환해야 합니다.

prisma에서도 transaction을 위한 여러 가지 방법을 제공합니다.

> [!NOTE] HINT
> 자세한 내용은 [공식문서](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)를 참고해주세요.

### Nested writes

기본적으로 prisma는 중첩 쓰기 사용시 transaction을 제공합니다.

```ts
const updatedPost: Post = await prisma.post.update({
  where: { id: 42 },
  data: {
    author: {
      connect: { email: "alice@prisma.io" },
    },
  },
});
```

post의 update는 author의 생성과 함께 처리되어야 합니다.

### The `$transaction` API : [Sequential operations](https://www.prisma.io/docs/orm/prisma-client/queries/transactions#sequential-prisma-client-operations)

PrismaClient에 `$transaction`을 통해 prima 작업에 대한 `Promise[]`를 제공하면 작업들에 대해 transaction을 시행합니다.

```ts
const [posts, totalPosts] = await prisma.$transaction([
  prisma.post.findMany({ where: { title: { contains: "prisma" } } }),
  prisma.post.count(),
]);

// row query 또한 가능합니다.
const [userList, updateUser] = await prisma.$transaction([
  prisma.$queryRaw`SELECT 'title' FROM User`,
  prisma.$executeRaw`UPDATE User SET name = 'Hello' WHERE id = 2;`,
]);
```

> [!NOTE] HINT
> prisma row query에서 사용하는 문법은 [Tagged Template Function](https://blog.ateals.me/posts/docs/jsts/Tagged%20Template%20Literal)입니다.

### The `$transaction` API :Interactive transactions

또 다른 `$transaction` 사용법은 runner를 매개변수로 받는 비동기 콜백 함수를 제공하는 것입니다.

```ts
prisma.$transaction(async (tx) => {
  // 1. Decrement amount from the sender.
  const sender = await tx.account.update({
    data: {
      balance: {
        decrement: amount,
      },
    },
    where: {
      email: from,
    },
  });

  // 2. Verify that the sender's balance didn't go below zero.
  if (sender.balance < 0) {
    throw new Error(`${from} doesn't have enough to send ${amount}`);
  }

  // 3. Increment the recipient's balance by amount
  const recipient = await tx.account.update({
    data: {
      balance: {
        increment: amount,
      },
    },
    where: {
      email: to,
    },
  });

  return recipient;
});
```

> [!WARNING] WARNING
> 트랜잭션을 장시간 열어두면 데이터베이스 성능이 저하되고 교착 상태가 발생할 수 있습니다. 트랜잭션 내부에서 느린 쿼리나 네트워크 요청을 실행하지 않도록 하세요.

## Prisma Transaction Interceptor

Interceptor를 구현하기 위해서는 `Interactive transactions`과 함께 prisma에서 제공하는 [`client-extensions`](https://github.com/prisma/prisma-client-extensions/tree/main/callback-free-itx)을 사용해야합니다.

> [!info] INFO
> 구현한 모든 구현체는 [저장소](https://github.com/ATeals/nest-monorepo/tree/main/libs/prisma)에서 확인할 수 있습니다.

[`client-extensions`](https://github.com/prisma/prisma-client-extensions/tree/main/callback-free-itx)을 전부 설명하지는 않고 Promise와 Proxy를 통해 외부에서 내부의 callback에 접근할 수 있다는 아이디어만 가지고 설명하겠습니다.

기존 Prisma Package는 Repository와 Service를 제공합니다.

이때 PrismaService는 PrismaClient를 확장하는 데 Transaction을 사용하기 위해서는 `$begin`메서드를 확장해야 합니다.

이를 위해서 `withTransaction()` 유틸을 통해 PrismaService를 확장합니다.

```ts
@Injectable()
export class PrismaService extends withTransection(PrismaClient) implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: ["query"] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

`withTransaction()` 유틸은 인자로 받은 PrismaClient를 확장하면서 `$begin` 메서드를 재공하는 class를 반환합니다.

이후 transaction을 사용하고자 하는 Controller 메서드에 `TransactionInterceptor`를 선언하고 `runner`를 제공받습니다.

```ts
 @Get('/test')
  @UseInterceptors(PrismaTransectionalInterceptor)
  async test(@PrismaTransectionRunner() runner: PrismaService) {
    await this.userRepository.create({ data: { name: 'Asdasdasd', email: 'check ema asd asdasdasd il entity' } }, runner.user);

    return 'user';
  }
```

이후 `PrismaRepository`에 해당 쿼리를 실행할 runner를 제공합니다.

```ts
export class PrismaTransectionalInterceptor implements NestInterceptor {
  constructor(@Inject(PRISMA_SERVICE) readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();

    const runner = await this.prisma.$begin();

    req[PRISMA_TRANSECTIONRUNNER] = runner;

    return next.handle().pipe(
      catchError(async (e) => {
        await runner.$rollback(e);
      }),
      tap(async () => {
        await runner.$commit();
      })
    );
  }
}
```

`PrismaTransectionalInterceptor` 내부를 살펴보면 PrismaService를 주입받아 `$begin()`을 통해 transaction을 실행합니다.

이후 컨트롤러에 응답 결과에 따라 `rollback`과 `commit`을 선택합니다.

- 만약 해당 컨트롤러에서 error가 throw 된다면 트랜잭션을 롤백 합니다.
- 해당 컨트롤러가 정상적으로 처리된다면 트랜잭션을 commit 합니다.

`Prisma Transaction Interceptor`를 통해서 layer에 목적에 맞는 역할과 책임을 유지하면서 트랜잭션을 수행할 수 있게 되었습니다.

하지만 `Prisma Transaction Interceptor`는 트랜잭션 시 각 layer들을 통과하는 runner를 제공해야 한다는 단점이 있습니다.

따라서 다음번에는 nest-cls나 Async Local Storage를 사용해 Transaction propagation을 구현해 보도록 하겠습니다.
