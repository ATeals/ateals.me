---
title: RORO 패턴과 Class Constructor
description: 자바스크립트의 Receive an object, Return an object
image: https://i.imgur.com/U1HbIag.png
date: 2024-08-04T22:20
tags:
  - JavaScript
  - TypeScript
  - 스니펫
slug: roro-class-constructor
---

## RORO

> https://taegon.kim/archives/8058

RORO는 Receive an object, Return an object의 줄임말로  **"객체로 받고 객체로 반환한다(Receive an object, return an object)"** 라는 의미다.

ES6의 [구조분해 할당(destructuring assignment)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)을 통해 가능해졌다. 이 패턴에는 다음과 같은 장점이 있다.

- 명명된 인수 (Named parameter)
- 더 명료한 인수 기본값
- 더 많은 정보 반환
- 함수 합성의 용이함

예시는 다음과 같다:

```ts
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

function increaseAge(user: User): User {
  return {
    ...user,
    age: user.age + 1
  };
}
```

RORO 패턴을 사용하면 객체 리터럴을 통해 보다 정확한 명명인수와 함께 사용할 수 있다.

## RORO 활용

> https://x.com/colinhacks/status/1818047762891506050?s=46 >https://x.com/colinhacks/status/1818048345644126416?s=46

이를 통해 기존에 생성자에 인자가 많은 함수의 경우에도 명명된 인수를 사용할 수 있다.

```ts
class Person {
  firstName: string;
  lastName: string;
  points: number;

  constructor(info: { firstName: string; lastName: string; age: number }) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.points = info.age;
  }
}

const person = new Person({ firstName: 'colin', lastName: 'firth', age: 42 });
```

RORO패턴을 통해 생성자를 선언하면 타입스크립트에서 constructor를 위한 새로운 인터페이스를 선언해야 한다.

이를 간단하게 나타내기 위해 다음과 같은 패턴을 사용할 수 있다.

```ts
type ExtractPublicProps<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;

class Player {
  public firstName: string;
  public lastName: string;
  public points: number;

  constructor(props: ExtractPublicProps<Player>) {
    Object.assign(this, props);
  }
}

const player = new Player({ firstName: 'colin', lastName: 'firth', points: 42 });
```

`ExtractPublicProps` 유틸 타입을 통해 class의 Public한 Property를 constructor로 받을 수 있다.

다만, 단점이 있는데 `get` 접근자도 Property로 인식하기 때문에 문제가 발생할 수 있다.

```ts
class Player {
  public firstName: string;
  public lastName: string;
  public points: number;

  constructor(props: ExtractPublicProps<Player>) {
    Object.assign(this, props);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const player = new Player({ firstName: 'colin', lastName: 'firth', points: 42 });

/**

'{ firstName: string; lastName: string; points: number; }' 형식의 인수는 'ExtractPublicProps<Player>' 형식의 매개 변수에 할당될 수 없습니다.
  'fullName' 속성이 '{ firstName: string; lastName: string; points: number; }' 형식에 없지만 'ExtractPublicProps<Player>' 형식에서 필수입니다.

*/
```
