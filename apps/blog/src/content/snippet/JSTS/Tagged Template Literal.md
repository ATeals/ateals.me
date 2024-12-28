---
title: Tagged Template Literal
description: js
image:
date: 2024-06-07T17:56
tags:
  - JavaScript
slug: tagged-template-literal
---

sytled-components를 사용해봤다면 다음과 같은 코드를 본적이 있을 것이다.

```js
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;
```

다음과 같은 코드를 `Tagged Template Function , tag function`이라고 부른다.

### Template literals (Template strings)

기본 탬플릿 리터럴로 작성하는 문자열은 다음과 같다.

```js
const a = 5;
const b = 10;

console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);

// "Fifteen is 15 and
// not 20."
```

### Tagged templates

> [!NOTE] [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
> 보다 고급 형태의 템플릿 리터럴은 태그가 지정된 템플릿입니다.
>
> 태그를 사용하면 함수를 사용하여 템플릿 리터럴을 구문 분석할 수 있습니다. 태그 함수의 첫 번째 인수는 문자열 값의 배열을 포함합니다. 나머지 인수는 표현식과 관련이 있습니다.
>
> 그러면 태그 함수는 이러한 인수에 대해 원하는 연산을 수행하고 조작된 문자열을 반환할 수 있습니다. (또는 다음 예제 중 하나에 설명된 것처럼 완전히 다른 것을 반환할 수도 있습니다.)
>
> 태그에 사용되는 함수의 이름은 원하는 대로 지정할 수 있습니다.

```js
const person = 'Mike';
const age = 28;

function myTag(strings, personExp, ageExp) {
  const str0 = strings[0]; // "That "
  const str1 = strings[1]; // " is a "
  const str2 = strings[2]; // "."

  const ageStr = ageExp < 100 ? 'youngster' : 'centenarian';

  // We can even return a string built using a template literal
  return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

const output = myTag`That ${person} is a ${age}.`;

console.log(output);
// That Mike is a youngster.
```

### 활용 사례

[styled-component](https://styled-components.com/)

https://marpple.github.io/rune/
