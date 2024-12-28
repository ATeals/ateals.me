---
title: forEach대신 for ... of
description: 가독성을 높이는 이터러블 순회
image: https://i.imgur.com/U1HbIag.png
date: 2024-08-06T18:24
tags:
  - JavaScript
  - TypeScript
  - 스니펫
slug: no-foreach
---

JavaScript에서 이터러블을 순회하며 각각의 값에 대해 처리를 하고 싶을 때, 크게 두 가지 방법이 있다:

- `Array.prototype.forEach()`
- `for ... of`

예를 들어, 객체의 값을 순회하고자 할 때 두 메서드는 다음과 같이 사용할 수 있다.

```ts
const studentScores = {
  Alice: 85,
  Bob: 92,
  Charlie: 78
};

const entries = Object.entries(studentScores);

for (const [student, score] of entries) {
  console.log(`${student} scored ${score}`);
}

Object.entries(studentScores).forEach(([student, score]) => console.log(`${student} scored ${score}`));
```

다만 다른 순회 메서드와는 다르게 `forEach`는 오직 순회의 용도로만 존재하기 때문에 값을 반환하지 않는다.

만일 `forEach` 콜백함수의 내용이 길어지게 된다면, 메서드 내부의 길이가 길어지는 형식이 된다. 또한 forEach는 함수 스코프를 가지게 되므로 가급적이면 순회 작업에서는 `for ... of`를 사용하는 편이다. 또한 블록 스코프로 얻을 수 있는 `break` `continue` `await` 키워드에 대한 제약이 생긴다.

> [!info] INFO
> [이곳](https://techblog.woowahan.com/15903/)에서 `for ... of`에 대한 의견을 접할 수 있다.

```ts
const studentScores = {
    "Alice": 85,
    "Bob": 92,
    "Charlie": 78
};

const entries = Object.entries(studentScores);

entries.forEach((item)=>{


... // 콜백의 내용이 길어지면 가독성에 부담을 준다.

// forEach는 메서드이기 때문에 값의 의미로 받아질 수도 있다.


})

for(const item of entries){

 ...// 문의 내용이 길어져도 메서드보다 절차적인 코드에 맞는 느낌을 준다.

 // 값으로 받아질 여지가 없다.

}

```

`Object.property.entries()` 를 통해 순회하다보면 forEach() 처럼 key, value 이외에 index가 필요한 경우가 생길 수 있다.

이럴땐 한번 더 `Object.property.entries()`를 통해 index 형식을 받아오거나 `for ... in` 을 통해 index 값만 받아서 호출할 수 있다.

```ts
const studentScores = {
  Alice: 85,
  Bob: 92,
  Charlie: 78
};

const entries = Object.entries(studentScores);

for (const [index, [student, score]] of entries.entries()) {
  console.log(index, student, score);
}

for (const index in entries) {
  const [student, scrore] = entries[index];

  console.log(index, student, score);
}
```

이러한 방식을 통해 forEach와 같이 `index`와 각 `item`의 `key, value`를 순회할 수 있다.
