---
title: 나만의 작고 소중한 IOC 컨테이너를 만들어 백엔드 구조화 하기
description: express를 그냥 사용하라고....? 그게 뭐예요? 아니 어떻게 하는 건데요...
image: https://i.imgur.com/Yr3c8YF.png
date: 2024-09-12T18:09
updated: 2024-12-13T18:09
tags:
  - TypeScript
  - JavaScript
  - 네부캠
slug: mini-nest
---

> 전체 코드는 [여기](https://github.com/ATeals/mini-Web-Framework/tree/main/src/.core/be)에서 확인할 수 있습니다.

> [!info] 글을 읽기 전에
>
> - 글에서 나오지 않는 내용
>   - 전체 코드에 대한 설명
>   - Spring, Nest에 대한 설명
> - 글에서 나오는 내용
>   - 일부 코드에 대한 설명
>   - IOC 컨테이너를 만들어가는 과정

Node.js 생태계에서 가장 기본적인 WAS 프레임워크를 꼽자면 Express가 떠오릅니다. NestJS도 결국 express 위에서 동작하는 프레임워크이므로, 결국 Node.js 백엔드 개발자는 Express를 자주 사용하게 될 겁니다. ([fastify](https://fastify.dev/) 도 있긴 하죠. ㅎㅎ)

저도 이번에 풀스택으로 과제를 하면서 Express를 사용하게 되었습니다. 사실 요구사항이 간단한 편이어서 Express만으로도 충분히 서버를 구성할 수 있었지만, 저는 이미 MVC 패턴에 익숙해져 있는 상태였기 때문에 좀 더 구조화된 방식으로 작업을 해보고자 했습니다. 4주간 요구사항이 계속 변경되고 추가될 예정이었기에, 구조화를 하지 않으면 소스 코드 관리가 매우 어려울 것이라 판단했습니다.

WAS를 구성할 때 많이 사용하는 Spring, Nest는 계층형 아키텍처를 기본으로 구조화를 합니다.  이를 참고하여, 저도 각 모듈을 넘겨주면 자동으로 서버를 구성할 수 있는 IOC 컨테이너를 설계하기로 했습니다.

> IOC (Inversion of Control)
>
> **제어의 역전**는 프로그래머가 작성한 프로그램이 재사용 라이브러리의 [흐름 제어](https://ko.wikipedia.org/wiki/%ED%9D%90%EB%A6%84_%EC%A0%9C%EC%96%B4 '흐름 제어')를 받게 되는 [소프트웨어 디자인 패턴](https://ko.wikipedia.org/wiki/%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4_%EB%94%94%EC%9E%90%EC%9D%B8_%ED%8C%A8%ED%84%B4 '소프트웨어 디자인 패턴')을 말한다. 줄여서 **IoC**(Inversion of Control)이라고 부른다. 전통적인 프로그래밍에서 흐름은 프로그래머가 작성한 프로그램이 외부 라이브러리의 코드를 호출해 이용한다. 하지만 **제어의 역전**이 적용된 구조에서는 외부 라이브러리의 코드가 프로그래머가 작성한 코드를 호출한다. 설계 목적상 **제어의 역전**의 목적은 다음과 같다:
>
> - 작업을 구현하는 방식과 작업 수행 자체를 분리한다.
> - 모듈을 제작할 때, 모듈과 외부 프로그램의 결합에 대해 고민할 필요 없이 모듈의 목적에 집중할 수 있다.
> - 다른 시스템이 어떻게 동작할지에 대해 고민할 필요 없이, 미리 정해진 협약대로만 동작하게 하면 된다.
> - 모듈을 바꾸어도 다른 시스템에 부작용을 일으키지 않는다.
>
> [위키 백과](https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%96%B4_%EB%B0%98%EC%A0%84)

## 초기 IOC

Express 서버를 구성하기 위해 각 라우터가 필요한 것이 무엇인지 고민했습니다. 간단하게 서버를 구성하기 위해서 Express router에서는 다음이 필요하다고 생각했습니다:

- `router의 path` 라우터를 사용할 path를 필요로 합니다. path에 요청이 들어오면 해당 요청은 router가 처리합니다.
- `컨트롤러` 라우터로 들어온 요청을 처리합니다.
- `뷰` 라우터의 응답을 처리합니다.
- `미들웨어` 라우터의 미들웨어와 각 메서드에 미들웨어를 필요로 합니다.

이러한 라우터 구성을 바탕으로 제가 설계한 Module 인터페이스는 다음과 같습니다.

```ts
export interface Module<T extends Polity<string>> {
  Polity: T;
  Entity: Record<string, Entity>;
  routePath: string;
  Controller: Contructor;
  View: Contructor;
  Middlewares?: Middleware[];
  Providers?: Contructor[];
}
```

- `Polity` : 모듈의 정책입니다. 서버의 엔드포인트와 HTTP 메서드에 따른 경로, 메서드 미들웨어를 연결합니다.
- `Entity` : 모듈에서 사용할 Entity입니다.
- `routePath` : 해당 라우터의 엔드포인트입니다.
- `Controller` : 컨트롤러는 Polity의 Key에 해당하는 메서드를 구현해야 합니다. 이를 통해 각 Polity에 맞게 express의 Request를 처리해 데이터로 반환합니다.
- `Providers` : Controller에 의존성이 필요할 때 주입할 class 생성자를 담습니다.
- `View` : 뷰는 Polity의 Key에 해당하는 메서드를 구현해야합니다. 이를 통해 각 Polity에 맞게 express의 Response와 컨트롤러의 반환값을 처리합니다.
- `Middlewares` 해당 모듈에 적용할 미들웨어입니다.

간단한 Todo리스트 서버를 예시로 모듈을 구성해보겠습니다.

### Polity

먼저 Polity를 작성합니다. Todo 리스트 CRUD를 구현하기 위해서 CRUD_Polity를 사용합니다.

```ts
export const CRUD_POLITY: Record<keyof typeof CRUD, ExpressPolity> = {
  [CRUD.CREATE]: {
    METHOD: 'post',
    PATH: (query: string) => '/',
    MIDDLEWARE: [AuthGuard()] // 해당 엔드포인트에 미들웨어가 필요하다면 선언해 사용합니다.
  },
  [CRUD.UPDATE]: {
    METHOD: 'patch',
    PATH: (query: string) => `/:${query}`,
    MIDDLEWARE: [AuthGuard()]
  },
  [CRUD.DELETE]: {
    METHOD: 'delete',
    PATH: (query: string) => `/:${query}`,
    MIDDLEWARE: [AuthGuard()]
  },
  [CRUD.FIND_MANY]: {
    METHOD: 'get',
    PATH: (query: string) => '/'
  },
  [CRUD.FIND_ONE]: {
    METHOD: 'get',
    PATH: (query: string) => `/:${query}`
  }
};
```

### Controller

이후 CRUD_POLITY에 맞는 Controller와 View를 선언합니다. 각 CRUD 메서드는 요청을 받아 처리하며, 비즈니스 로직은 TodoRepository를 통해 수행됩니다.

```ts
export class TodoController extends Controller implements PolicyExecutor<typeof CRUD_POLITY> {
  constructor(private repo: TodoRepository) {
    super();
  }

  [CRUD.CREATE](req: Request) {
    return this.repo.create(req.body);
  }

  [CRUD.UPDATE](req: Request) {
    const selector = this.getParams(req);

    return this.repo.update(selector, req.body);
  }

  [CRUD.DELETE](req: Request) {
    const selector = this.getParams(req);

    return this.repo.delete(selector);
  }

  [CRUD.FIND_MANY](req: Request) {
    return this.repo.findMany({});
  }

  [CRUD.FIND_ONE](req: Request) {
    const selector = this.getParams(req);

    return this.repo.findOne(selector);
  }
}
```

View는 PolicyExecutor를 구현해야합니다. 이때 Controller의 반환 데이터와 Response를 매개변수로 받아 동작합니다.

마지막으로 Entity를 정의합니다.

```ts
export const TodoEntity = {
  content: { type: 'string' },
  isDone: { type: 'boolean' }
} satisfies Record<string, Entity>;
```

엔티티는 추후에 검증 미들웨어에서 사용됩니다. 또는 Polity.PATH에 파라미터로 넘어올 값을 선택할 수 있습니다. `content`에 `{primary : true}` 속성을 선언하면 라우터에 넘어온 파라미터를 content값과 비교합니다.

### Provider

이후 Controller에서 필요한 의존성을 `Providers` 배열에 선언합니다.

```ts
export const TodoModule: Module<typeof CRUD_POLITY> = {
  routePath: '/todos',
  Polity: CRUD_POLITY,
  Entity: TodoEntity,
  View: CRUDRestView,
  Controller: TodoController,
  Providers: [TodoRepository]
};
```

만들어진 모듈을 Bootstrap에 적용하면, Bootstrap이 express를 통해 서버를 구성해줍니다.

```ts
const app = Bootstrap.setModules(TodoModule).create();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### 결과

이렇게 만들어진 Bootstrap의 장점은 무엇일까요?

- **개발자는 아키텍처를 고려할 필요가 없습니다.** 개발자는 처리해야 하는 요구사항에 대한 Polity와 Controller, View를 구현하면, 서버 구성은 Bootstrap이 자동으로 처리합니다. 더 이상 Express와의 연결을 고려할 필요가 없습니다.
- **각각의 계층(Bootstrap에서 PolityExcuter)의 의존도가 낮습니다.** 만일 JSON 응답 방식을 사용하다. 템플릿 엔진으로 응답 방식을 변경해야 한다면, Module의 View만 변경하면 됩니다. 실제 DB를 연결한다면 Contorller에 제공하는 Providers에 실제 Database와 연결한 Repository를 공급해주면 됩니다. 각 계층은 역할에 따라 분리되어있기 때문에 변경사항에 해당하는 계층만 변경해주면 됩니다.
- **모듈의 응집력이 높습니다.** Express는 아키텍처 자유도가 높기때문에 코드가 분산되어 라우터에 대한 응집력이 떨어질 수 있습니다. 반면에 Bootstrap의 Module은 각각의 계층을 리터럴 객체로 연결해 서버의 엔드포인트와 함께 관리합니다. 개발자는 각각의 서비스에 대해서 독립적으로 유지보수할 수 있습니다.
- **여전히 express입니다.** `Boostrap.create()`는 결국 Express app을 반환합니다. 만일 Bootstrap으로 구현하기 힘든 요구사항이라면 일반 Express app을 통해 서버를 구성할 수 있습니다. 따라서 손쉽게 기존의 Express app과 병합할 수 있습니다.

하지만 단점 또한 존재합니다.

- **검증을 Controller 내부에서 작성해야 합니다.** 미들웨어에서 검증을 하고 값을 반환할 수 있지만 제한적이고, 검증 로직을 어디에 구현할지 개발자가 항상 고민하고, 코딩해야 합니다. 이는 휴먼에러가 발생하거나, WET한 코드가 나올 가능성이 높습니다.
- **컨트롤러에서 응답을 직접 보낼 수 없습니다.** passprot같은 외부 의존성으로 요청, 응답을 보내주는 모듈은 Bootstarp을 사용할 수 없습니다. 실제로 요구사항을 처리하는 과정 중에서 Bootstrap으로 해결할 수 없는 문제들이 발생해 많은 경우 Bootstrap을 사용할 수 없었습니다.
- **Entity가 불필요합니다.** 사실 Entity는 서버 구성과는 밀접하지 않은 리소스입니다. Entity가 필요 없는 경우도 있고 검증을 위해서 Bootstrap은 불필요한 Entity의 존재를 알고 있어야 했습니다.
- **Provider의 관리가 어렵습니다.** 가장 큰 문제는 Provider의 의존성은 Bootstrap이 관리해 주지 않고, 단순히 Controller에 연결해 주기 때문에 계층형 아키텍처의 이점을 제대로 활용할 수 없다는 점이었습니다. 물론 순환 종속성에도 매우 취약합니다.

## 데코레이터로 개선하기

[[데코레이터와 메타 프로그래밍 | 데코레이터]]를 학습하고 나서 데코레이터를 통해 기존 Bootstrap을 개선해 봤습니다. 이제 Bootstrap은 보다 NestJS와 가까운 모습이 되었습니다.

Bootstrap에서 DI를 위해서 [tsyringe](https://github.com/microsoft/tsyringe)라는 라이브러리를 사용했습니다.

> 데코레이터를 통해 메타 프로그래밍을 하기 위해서는 reflect-metadata 폴리필을 사용해야 합니다.

이번에도 예시를 통해서 설명하겠습니다.

### `@Controller()` `@Injectable()` `@Inject()`

```ts
@Injectable()
class AppService {
  getAll() {
    return 'getAll from AppService';
  }
}

@Controller('/')
class AppController {
  constructor(@Inject(AppService) private app: AppService) {}

  @Get('/')
  getAll() {
    return this.app.getAll();
  }
}
```

이제 Provider는 `@Injectable()` 데코레이터를 통해 주입 가능함을 명시해야 합니다. 이후 사용처에서 `@Inject()` 데코레이터를 통해 주입합니다.

Controller는 `@Controller()` 데코레이터를 사용합니다. 경로를 인자로 전달해 해당 router의 엔드포인트를 설정할 수 있습니다.

Controller의 각메서드에 `RoutesDecorator`를 통해서 Controller에 들어온 요청을 http method에 따라 처리할 수 있습니다.

지원하는 `RoutesDecorator`는 다음과 같습니다.

- `@Get()`
- `@Post()`
- `@Put()`
- `@Patch()`
- `@Delete()`

### `@Module`

이후 만들어진 컨트롤러를 Bootstrap에서 사용하기 위해서 Module class를 구현합니다.

```ts
@Module({
  Controller: TodoController,
  ErrorHandler: CommonErrorHandler
})
export class TodoModule {}
```

`@Module` 데코레이터는 두 가지 속성을 가진 리터럴 객체를 받습니다.

- **Controller** : `@Controller()`로 선언된 라우트 컨트롤러 객체로, 요청을 처리합니다.
- **ErrorHandler** :기본 에러 핸들러 대신 사용할 커스텀 에러 핸들러 함수입니다.

ORM이나 인증과 같은 몇몇 모듈들은 Controller 대신에 Express 서버에 설정해야 하는 방법이 필요할 수 있습니다. 또는, 모듈을 구성할 때 비동기로 구성해야 하는 모듈이 존재할 수 있습니다.

이때는 각 모듈에서 `static generator` 메서드를 선언해 사용하면 됩니다.

```ts
@Module({
  Controller: AuthController,
  ErrorHandler: CommonErrorHandler
})
export class AuthModule {
  static generate(passport: any) {
    LocalStrategy.create(passport);

    return {
      Controller: AuthController,
      ErrorHandler: CommonErrorHandler
    };
  }
}
```

```ts
export const app = Bootstrap.setModules(AuthModule.generate(passport), UsersModule).create();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

이렇게 만든 데코레이터들을 통해서 몇 가지 기존의 문제점을 개선했습니다.

- **Provider의 관리가 보다 쉬워집니다.** (tsyringe가 다해주지만..) `@Controller`와 `@Module`을 통해서 개발자는 의존성 주입을 고민하지 않고 필요한 만큼 여러 계층으로 분리해 모듈을 구성할 수 있습니다.
- **유연하게 에러 핸들링 할 수 있습니다.** 기본적으로 라우터에서 발생한 에러를 핸들링 해주지만 ErrorHandler를 통해 각 모듈마다 별도의 에러를 처리할 수 있습니다.

### 유틸 데코레이터

NestJS처럼, 데코레이터를 활용한 Bootstrap도 컨트롤러에서 편리하게 사용할 수 있는 여러 유틸 데코레이터를 지원합니다. 데코레이터를 도입한 Bootstrap의 목적은 유연한 설계를 제공하는 것이기 때문에, 필요한 다양한 데코레이터들을 지원하고자 했습니다.

`@UseMiddlewares(...middlewares[])`

이 데코레이터를 사용하면 미들웨어를 등록할 수 있습니다.

- 클래스에 선언하면 해당 라우터의 **전역 미들웨어**로 작동합니다.
- 메서드에 선언하면 **메서드 미들웨어**로 작동합니다.

미들웨어는 **라우터 전역 미들웨어 -> 메서드 미들웨어** 순서로 실행됩니다.

```ts
@Controller('/')
@UseMiddlewares((req, res, next) => {
  console.log('middleware from controller');
  next();
})
class AppController {
  constructor(@Inject(AppService) private app: AppService) {}

  @Get('/')
  @UseMiddlewares((req, res, next) => {
    console.log('middleware from method');
    next();
  })
  getAll() {
    return this.app.getAll();
  }
}
```

![**라우터 전역 미들웨어 -> 메서드 미들웨어**](https://i.imgur.com/u45dDEG.png)

`ParamsDecorator`

컨트롤러에서는 메서드에 매개변수로 여러가지 파라미터 데코레이터를 사용할 수 있습니다.

| 데코레이터 | 설명                                      |
| ---------- | ----------------------------------------- |
| @Req       | Express의 요청 객체를 받습니다.           |
| @Res       | Express의 응답 객체를 받습니다.           |
| @Body      | Express의 요청 객체의 body값을 받습니다.  |
| @Query     | Express의 요청 객체의 query값을 받습니다. |
| @Param     | Express의 요청 객체의 param값을 받습니다. |

```ts
@Controller('/')
class AppController {
  @Get('/')
  getAll(@Req() req: Request) {
    return { req };
  }
}
```

`@Req`에서 파생된 모든 데코레이터 (`@Body`, `@Query`, `@Param`)는 인자로 Pipe함수를 받을 수 있습니다.

Pipe함수는 전달된 데이터를 검증하고 변환한 후, 최종적으로 매개변수로 전달하는 책임을 가집니다.

```ts
@Controller('/')
class AppController {
  @Get('/')
  getAll(@Query(({ id }) => Number(id)) id: number) {
    return { id };
  }
}
```

![숫자로 반환되는 ID](https://i.imgur.com/hJMVxLy.png)

자주 사용되는 데코레이터와 Pipe는 **커스텀 데코레이터**로 래핑하여 더 편리하게 사용할 수 있습니다.

```ts
const Id = () => Query(({ id }) => Number(id));

@Controller('/')
class AppController {
  @Get('/')
  getAll(@Id() id: number) {
    return { id };
  }
}
```

이렇게 만든 유틸 데코레이터들을 통해서 몇가지 기존의 문제점을 개선했습니다.

- **검증을 Controller내부에서 관리하지 않습니다.** 물론 아직 컨트롤러 내부에서 검증을 수행하지만, 유틸 테코레이터를 사용하므로 보다 유연하게 검증하고 타입을 관리할 수 있습니다.
- **컨트롤러에서 요청, 응답을 관리합니다.** 요청 객체가 필요한 경우 `@Req`로, 응답 객체가 필요한 경우 `@Res`로 쉽게 가져올 수 있습니다. 기본적으로 컨트롤러가 반환하는 데이터는 자동으로 응답으로 보내지지만, 필요에 따라 직접 응답을 관리할 수도 있습니다.
- **Bootstrap에서 Entity가 불필요합니다.** 더 이상 Bootstrap자체는 엔티티를 관리하지 않고 유틸 데코레이터를 통해서 직접 컨트롤러에서 사용 가능합니다. 또한 엔티티 타입을 검증하는 파이프를 직접 만들어서 재사용 가능한 데코레이터를 설계할 수 있습니다.

## 마치며

만들다 보니 결국 미니 NestJS 같은 모습이 된 것 같습니다. Bootstrap을 통해 Express에서 보다 유연한 구조로 설계할 수 있게 되었습니다.

또한, 엔티티 검증, 라우터 설계, 미들웨어 적용과 같은 도메인과는 관련 없는 횡단 관심사를 데코레이터로 처리하면서, 비즈니스 로직과 횡단 관심사를 분리하는 **AOP(Aspect-Oriented Programming)** 도 간접적으로 경험해 본 것 같습니다.

Bootstrap을 만들면서, 지금까지 라이브러리의 품 안에서 얼마나 안전하게 개발하고 있었는지 다시 한번 느낄 수 있었습니다.
