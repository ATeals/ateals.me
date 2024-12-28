---
title: 디스패치 테이블과 TS
description: 최애의 JS 테이블을 통한 분기와 TS에서 활용하는 방법
image:
date: 2024-08-06T21:37
tags:
  - JavaScript
  - TypeScript
  - 스니펫
slug: dispatch-table
---

> [디스패치 테이블](https://ko.wikipedia.org/wiki/%EB%94%94%EC%8A%A4%ED%8C%A8%EC%B9%98_%ED%85%8C%EC%9D%B4%EB%B8%94)

기본적으로 다중 `if ... elseif ... else`와 `switch`는 지양하는 편이다. 가독성도 좋지 않고 분기를 위한 코드가 많다고 느껴지기 때문이다.

계산기를 위한 분기문을 작성하는 예시를 통해 확인해 보자.

```ts
//Bad

type Operater = '+' | '-' | '*' | '/';

const calculate = (operator: Operater, a: number, b: number) => {
  if (operator === '+') return a + b;
  else if (operator === '-') return a - b;
  else if (operator === '*') return a * b;
  else if (operator === '/') return a / b;
  else throw new Error('Invalid operator');
};

const calculate = (operator: Operater, a: number, b: number) => {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      throw new Error('Invalid operator');
  }
};
```

계산기 함수가 매우 간단한 함수지만 예약어(`else`, `case`, `break`)들 때문에 많은 코드가 필요하다고 느껴진다.

이때 디스패치 테이블을 사용하면, 이런 예약어를 줄이고 가독성을 높일 수 있다.

```ts
const CALCULATE_DISPATH_TABLE = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b
};

type Operater = keyof typeof CALCULATE_DISPATH_TABLE;

const calculate = (operator: Operater, a: number, b: number) => CALCULATE_DISPATH_TABLE[operator](a, b);
```

내가 생각하는 디스패치테이블이 `else if`, `switch` 보다 좋다고 생각하는 이유는 다음과 같다.

- 조건이 명시적이다. 객체의 key값이 조건이므로 해당 코드가 해야하는 일을 명시적으로 나타낸다.
- 테이블을 사용하는 함수 외부에 위치할 수 있다.
- 타입을 위한 추가적인 코드를 작성하지 않아도 된다.

다만 TypeScript에서 디스패치 테이블을 사용하다보면 인자 타입을 맞춰주지 못하거나 추론할 때 타입에러를 많이 만들 수 있다.

이를 위해 `createDispatch`라는 함수를 만들었다.

```ts
type AnyFunction = (...args: any[]) => any;

type FunctionMap = {
  [key: string]: AnyFunction;
};

function createDispatch<T extends FunctionMap>(obj: T) {
  const execute = <K extends keyof T>(key: K, ...args: Parameters<T[K]>): ReturnType<T[K]> => {
    const func = obj[key];
    return func(...args);
  };

  const isKey = (key: any): key is keyof T => {
    return key in obj;
  };

  return [execute, isKey] as const;
}
```

`createDispath` 함수는 두 가지 함수를 담은 튜플을 반환한다.

- `execute` : 디스패치 테이블 실행 함수이다. 첫번째 인자로 디스패치 테이블의 키값과 키에 해당하는 함수의 인자를 인자로 받는다.
- `isKey` : 해당 값이 디스패치 테이블의 값인지 체크하고 이후 타입가드를 수행한다.

`createDispath` 함수를 사용하면 타입스크립트를 통해 타입 힌트도 받을 수 있고 `isKey`를 통해 타입 가드도 받을 수 있다.

```ts
const CALCULATE_DISPATH_TABLE = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b
};

const [calculate, isOperator] = createDispatch(CALCULATE_DISPATH_TABLE);

const cal = (key: string, arg: { a: number; b: number }) => {
  if (isOperator(key)) {
    return calculate(key, arg.a, arg.b);
  }
};
```

![dispatch.gif](https://i.imgur.com/2Eqy9mu.gif)
