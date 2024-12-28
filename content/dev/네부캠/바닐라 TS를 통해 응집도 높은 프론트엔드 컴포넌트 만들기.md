---
title: 바닐라 TS를 통해 응집도 높은 프론트엔드 컴포넌트 만들기
description: 직접 SPA를 만들면서...
date: 2024-09-11T15:56:00
updated: 2024-12-13T18:09
tags:
  - 프론트
  - TypeScript
  - 네부캠
slug: mini-component
---

> 전체 코드는 [여기](https://github.com/ATeals/mini-Web-Framework/tree/main/src/.core/fe)에서 확인할 수 있습니다.

제가 진행하고 있는 과정에서 요구사항으로 HTML, CSS, JS를 사용해 프론트를 개발할 일이 생겼습니다.

평소에 리액트와 같은 SPA 라이브러리를 통해서 모든 프론트 리소스를 타입 안정성이 확보된 타입스크립트 내부에서 개발하다가 다시 3가지 리소스로 분리하고자 하니 가독성과 응집도가 너무 아쉬웠습니다.

또한 이러한 코드는 리팩터링 시에도 문제를 일으킵니다. 응집도가 낮아 코드베이스 곳곳에 수정이 필요한 부분이 산재해 있기 때문입니다. 이로 인해 바텀업 방식으로 작업하는 것도 어려워지며, 합성 및 재사용 측면이 부족해 탑다운 방식으로 설계를 해야만 합니다. 이러한 문제를 해결하기 위해, 저는 컴포넌트를 설계하여 모든 리소스를 타입스크립트 내부에서 관리하는 방법을 고려하게 되었습니다.

일단 컴포넌트 설계 과정을 들어가기 전에 결과물을 먼저 보면 좋을 것 같습니다.

![최대한 react스러운 선언적인 컴포넌트](https://i.imgur.com/YIsSSms.png)

## 사용가능한 컴포넌트

설계를 하면서 `사용할 수 있는` 컴포넌트를 다음과 같이 정의해 봤습니다.

- 컴포넌트가 구조를 가지고 있고, 재사용 가능해야 한다.
- 상태를 각 컴포넌트가 가지고 있고, 이 상태를 통해 렌더링 해야 한다.
- 컴포넌트의 합성이 가능해야 한다.

### 컴포넌트가 구조를 가지고 있고, 재사용 가능해야한다.

먼저 컴포넌트의 구조를 생각해봤습니다. 컴포넌트는 결국 렌더링 해야할 html 탬플릿과 상태, 생명주기 메서드가 포함되어 있어야 한다고 생각했습니다. 이후 이전에 [유인동님의 멀티패러다임](https://www.youtube.com/watch?v=Ci3WGGEnmj4)을 주제로 한 영상이 떠올라 [rune](https://marpple.github.io/rune/guide/what-is-rune.html) 프레임워크 구조를 채용했습니다.

rune의 구조를 전부 설명하기에는 무리가 있고, 간단하게 html taggedTemplate는 html 탬플릿을 형성하는 헬퍼를 제공하는 객체인 Tmpl 객체를 반환하고, Component class가 렌더링을 통해 엘리먼트를 만들 때 Tmpl을 통해 만든다라는 키워드가 핵심인 것 같습니다.

```ts
render() {
const wapper = document.createElement('div');

wapper.innerHTML = this.template(this.state).toHtml();

const element = (wapper.firstElementChild! || '') as HTMLElement;

element.setAttribute(DATA_VIEW_ID, `${this._viewId}`);

this._element = element;

this.onRender();

return element;
}
```

이것은 컴포넌트의 render 메서드입니다. template 메서드를 통해 반환된 Tmpl class의 toHtml 메서드를 통해 문자열 html 탬플릿을 만들어 새로운 HTMLElement를 만들어주고 있습니다.

이후 오버라이딩 가능 한 this.onRender()를 통해 렌더링 시 추가 동작을 정의할 수 있습니다.

이를 통해 `컴포넌트가 구조를 가지고 있고, 재사용 가능해야한다.`를 해결했습니다.

### 상태를 각 컴포넌트가 가지고 있고, 이 상태를 통해 렌더링 해야한다.

컴포넌트를 만드는 두 번째 큰 목표는 상태를 기반으로 개발자가 직접 DOM API를 통해 돔을 제어하지 않아도 변화된 상태를 감지해 렌더링 해주는 것입니다.

이를 위해 옵저버 패턴을 사용했습니다.

> 옵저버 패턴은 옵저버들이 관찰하고 있는 대상의 상태가 변화하면 각 관찰자에게 통지하고 관찰자들은 조치를취하는 행동패턴이다.

옵저버를 구현하는 예시는 많으니 생략하겠습니다. 저는 `Store` 함수를 만들어 전달된 객체를 `Object.defineProperty`를 통해서 옵저버 패턴을 구현했습니다.

```ts
type Dispathcher<T> = (state: T) => void;

export type Observable<T> = T & {
  onChange: (dispatch: Dispathcher<T>) => void;
};

export const Store = <T extends object>(state: T) => {
  const subscribers = new Set<Dispathcher<T>>();

  const observable = Object.assign(state, {
    onChange: (dispatch: Dispathcher<T>) => subscribers.add(dispatch)
  });

  Object.keys(observable).forEach((key) => {
    let prevValue = state[key as keyof T];

    Object.defineProperty(observable, key, {
      get() {
        return prevValue;
      },

      set(value: T[keyof T]) {
        if (Object.is(prevValue, value)) return;
        prevValue = value;

        const { onChange, ...state } = observable;

        subscribers.forEach((fn) => fn(state as T));
      }
    });
  });

  return observable;
};

const state = Store({ count: 0 });

state.onChange((state) => console.log(state));

state.count = 1; // {count : 1}
```

이렇게 `Store.onChange`를 통해 옵저빙하는 대상의 상태가 변경되면 실행할 핸들러를 등록할 수 있습니다.

이 Store를 기존에 만들었던 컴포넌트에 생성자 매개변수를 받아 state 객체에 저장합니다.

이후 내부에 구현해둔 `_update` 메서드를 통해 state 변경을 감지해 컴포넌트를 리렌더링 할 수 있도록 만들었습니다.

```ts
export abstract class Component<T extends object = {}> {
  public state: Observable<T> = {} as Observable<T>;

  constructor(data: T = {} as T) {
    this.state = Store(data);

    this.state.onChange((state) => {
      this._update();
    });
  }

  private _update() {
    const element = this.render();

    this.target()!.replaceWith(element);
  }
}
```

이를 통해 `상태를 각 컴포넌트가 가지고 있고, 이 상태를 통해 렌더링 해야 한다.`라는 목표를 달성했습니다.

### 컴포넌트의 합성이 가능해야한다.

가장 어려운 문제였습니다. `rune`을 참고한 `template` 자체는 일단 합성이 가능해 보였습니다. 실제로 컴포넌트를 template 내부에서 선언하면 초기 렌더링을 성공하는 모습을 확인할 수 있습니다.

하지만 리렌더링은 불가능했습니다. Component의 render 구현 상 template 메서드를 통해 전체 탬플릿을 단순 문자열로 치환해 `innerHtml`하고 있었기 때문에 하위 컴포넌트의 `onRender`를 실행해 주진 못합니다. (하위 컴포넌트는 `render()`가 아닌 `template`만 반환하기 때문이죠.)

처음에 접근한 방법은 Tmpl에서 subTree라는 배열을 선언해 내부 컴포넌트를 저장하고 렌더링 해주는 방식이었습니다.

이 방식은 꽤 유효해 보였습니다. 다만 모든 배열을 반복하면서 다시 엘리먼트를 교체하는 작업은 매우 불필요해 보였고 성능 상 매우 안 좋아 보였습니다. 또한 단순히 렌더링 가능한 HTML을 만들어주는 Tmpl코드가 복잡해졌습니다. 심지어 중첩의 depth가 깊어질수록 정상적으로 동작하지 않는 경우도 생겼습니다.

다음으로 시도한 방법은 웹 API인 [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)를 사용한 방법입니다.

> MutationObserver 인터페이스는 DOM 트리의 변경 사항을 감시하는 기능을 제공합니다. 이 인터페이스는 DOM3 이벤트 사양의 일부였던 이전 변이 이벤트 기능을 대체하기 위해 설계되었습니다.

돔의 변경사항을 감지할 수 있기 때문에 하위 엘리먼트의 생명주기를 관리해 줄 수 있다고 생각했습니다.

다만 이 방식을 통해 Root class (앱의 HTML 진입점을 찾아 컴포넌트를 렌더링 시켜주는 class)의 코드가 매우 복잡 해졌습니다. Root에서는 각 Component를 넘겨받아. Component의 변경사항을 처리해줘야 하기 때문에 옵저버 핸들러가 매우 비대해지는 결과를 만들었습니다.

또한 합성을 하게 된다면 이후 Tmpl이나 Component 코드에서도 `MutationObserver` 코드가 사용될 수 있다고 생각했고 이는 너무 큰 복잡도를 낳을 것이라고 생각했습니다.

> [!info] 생각 포인트
> 이때쯤 회귀를 고려해야 했습니다. 더 이상 요구사항을 위해서 하염없이 설계에 시간을 투자하기에는 남은 시간이 별로 없다고 생각했습니다. (리뷰, 학습도 겸해야 하기 때문입니다.)

마지막으로 함께 공부하는 팀원분 들이 언급하신 [`CustomElement`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)를 떠올렸습니다.

CustomElement는 JS에서 HTMLElement를 상속받는 class입니다. CustomElement class에는 4가지 생명주기 메서드를 구현할 수 있습니다.

- `connectedCallback` : 커스텀 엘리먼트가 DOM에 추가될 때 호출됩니다.
- `disconnectedCallback` : 커스텀 엘리먼트가 DOM에서 제거될 때 호출됩니다.
- `adoptedCallback` :커스텀 엘리먼트가 다른 문서로 이동될 때 호출됩니다. 주로 iframe과 같은 상황에서 사용될 수 있습니다.
- `attributeChangedCallback` :  엘리먼트의 속성이 추가, 제거 또는 변경될 때 호출됩니다.

이를 통해 생각해 본 시나리오는 다음과 같습니다.

- 커스텀 엘리먼트를 돔에 렌더링 시킨다.
- 렌더링 된 커스텀 엘리먼트는 `connectedCallback`을 작동한다.
- 이후 실제 사용할 엘리먼트와 교체한다.

이러한 시나리오가 유효하기 위해서는 커스텀 엘리먼트가 다음과 같이 동작할 수 있는지 확인하는 과정이 필요했습니다.

- JS내에서 인스턴스로 생성이 가능하고, 이 인스턴스는 HTMLElment이면서 상속이 가능한가?
  - 인스턴스로 생성 가능하고 상속도 가능하지만, HTML에 렌더링 되고 사용하기 위해서는 자식 class도 모두 `customElements.define`을 통해 정의해야 합니다.
- 각 인스턴스는 자신의 속성을 소유하고, 변경할 수 있는가?
  - 가능합니다. 다만 렌더링 시점에 렌더링 된 HTML에는 직렬화 가능한 데이터만 slot에 넣어줄 수 있었고, shadowDom을 사용해야 했기 때문에 가능한한 모든 동작을 JS내부에서 처리해야합니다.
- append로 합성이 가능하고, innerHtml로 추가한 태그에 대해서도 customElement의 생명주기 메서드가 동작하는가? 이때 인스턴스로 인식하는가?
  - 결국 customElement는 HTMLElement를 상속하기 때문에 HTMLElement가 할 수 있는 모든 동작이 가능합니다. innerHtml로 추가해도 생명주기는 여전히 동작하고, 이를 인스턴스 형식으로 인식합니다.

간단한 실험을 통해서 3가지 동작이 증명 되었으므로 customElement를 통해 컴포넌트를 설계하고자 했습니다.

먼저 HTML에 렌더링 되고 사용하기 위해서는 자식 class도 모두 `customElements.define`을 통해 정의되어야 했기 때문에 이를 위한 헬퍼 함수를 만들었습니다.

```ts
export const defineComponent = <T extends CustomElementConstructor>(
  constructor: T,
  options: DefineComponentOptions = {}
): T => {
  const name = options.name || Math.random().toString(16).slice(2, 8);

  customElements.define(`c-${name}`, constructor);
  return constructor;
};
```

`defineComponent`는 생성자를 전달받아 `customElements`로 등록합니다. `defineComponent`를 통해 개발자는 Component를 선언할 때마다 별도로 `customElements`를 등록할 필요가 없습니다.

이후 Component class를 HTMLElement를 상속하고 `connectedCallback` 메서드를 선언해 수정합니다.

```ts {1 ,12-16}#add
export abstract class Component<T extends object = {}> extends HTMLElement {
  public state: Observable<T> = {} as Observable<T>;

  constructor(data: T = {} as T) {
    this.state = Store(data);

    this.state.onChange((state) => {
      this._update();
    });
  }

  connectedCallback() {
    const element = this.render();

    this.replaceWith(element);
  }

  private _update() {
    const element = this.render();

    this.target()!.replaceWith(element);
  }
}
```

이를 통해 실제 동작은 웹 컴포넌트가 먼저 들어갈 자리에 태그를 삽입하고 해당 태그를 사용할 엘리먼트로 교체하는 동작을 통해 구현할 수 있습니다.

![이렇게 커스텀 엘리먼트가 먼저 자리를 잡는다.](https://i.imgur.com/0cn29qN.png)
![이후 실제 컴포넌트 탬플릿으로 변경한다.](https://i.imgur.com/HxDl1uy.png)

커스텀 엘리먼트는 그 자체로 엘리먼트이기 때문에 문자열로 삽입해도 `connectedCallback`이 동작합니다. 즉 이제 Component의 template에서 다른 Component를 사용해 합성할 수 있습니다.

FlexBox를 예시로 들겠습니다.

![](https://i.imgur.com/zM0qWJZ.png)

![](https://i.imgur.com/W6igYbQ.png)

이제 이런 식으로 `컴포넌트의 합성이 가능해야 한다.` 를 해결했습니다.

![](https://i.imgur.com/nvsfhtH.gif)

예시를 보시면 변경되는 컴포넌트만 리렌더링 되는 모습을 확인할 수 있습니다.

## style

눈썰미가 좋으시다면, template에서 계속 style이라는 함수를 사용하는 것을 볼 수 있습니다.

CSS 속성과 값을 자동완성하기 위한 헬퍼 함수를 만들었습니다. 카멜 케이스로 작성한 CSS 속성 key를 케밥 케이스로 변경해 줍니다.

```ts
console.log(
  `${style({
    color: 'red',
    fontSize: '20px',
    fontWeight: 'bold'
  })}`
);

// style="color:red; font-size:20px; font-weight:bold; "
```

## 활용

이제 `사용 가능한` 컴포넌트를 설계했습니다. 다시 한번 `사용 가능한` 컴포넌트란 무엇인가 정의 하자면,

- 컴포넌트가 구조를 가지고 있고, 재사용 가능해야 한다.
- 상태를 각 컴포넌트가 가지고 있고, 이 상태를 통해 렌더링 해야 한다.
- 컴포넌트의 합성이 가능해야 한다.

이렇게 컴포넌트를 만들면 어떤 장점이 있을까요? 제가 생각해 본 장점은 다음과 같습니다.

- 선언적인 컴포넌트를 기반으로 `bottom-up`으로 작업이 가능합니다.
  - 먼저 `Todo` 컴포넌트를 만들고 이를 사용해 `TodoList`를 만드는 식으로 작은 단위부터 구현이 가능합니다.
- 디자인 시스템을 통해 재활용성을 높일 수 있습니다.
  - 요구사항에서 자주 사용되는 `Button`, `Avatar`, `Box`, `Header`, `Icon`과 같은 컴포넌트를 통해 디자인 시스템을 먼저 구축하고 요구사항을 해결할 수 있습니다.
- 프론트엔트 리소스의 응집도가 높아집니다.
  - 더 이상 프론트엔드 작업을 위해서 HTML, CSS, JS 파일을 옮겨 다니면서 작업할 필요가 없습니다. `Button`의 요구사항이 변경된다면 어떻게 해야하나요? `Button.ts`만 리팩터링하면 됩니다.
- 개발자가 렌더링을 신경 쓸 필요가 없습니다.
  - 컴포넌트는 상태변화를 감지하고 렌더링하기 때문에 더 이상 개발자는 상태변화에 따른 렌더링을 신경 쓸 필요가 없습니다.
- Component의 공개 API를 통해서 내부 상태를 제어할 수 있습니다.
  - 예를 들어 Button 컴포넌트에 click이라는 공개 메서드를 구현해 인스턴스 외부에서 버튼의 상태를 접근할 수 있습니다.

단점은 없을까요?

- 상태 관리를 신경 써야 합니다.
  - React에서 거론되는 prop drilling과 같은 문제를 고려해야 합니다. 또한 Object.is로 변경을 감지하는 상태 처리가 중요합니다.
- 부모가 리렌더링 된다면 자식도 리렌더링 됩니다.
  - 현재 컴포넌트에는 React의 `useMemo`같은 메모이제이션 훅이 없습니다. 따라서 부모 컴포넌트가 리렌더링 된다면 자식 컴포넌트도 리렌더링 됩니다.

결론적으로 Component class를 통해서 제가 원초적으로 해결하고자 했던 모든 리소스를 타입스크립트 내부에서 관리하고자하는 목적을 달성했습니다.

직접 바닐라로 SPA 컴포넌트를 구현해보면서 DOM API에 대해서 더 자세히 알게 된 것 같습니다.

## 데코레이터로 개선하기

[[데코레이터와 메타 프로그래밍 | 데코레이터]]를 학습한 뒤에 데코레이터로 기존 컴포넌트를 개선해보고자 했습니다.

### `@DefineComponent`

기존에 `defineComponent`으로 래핑해 컴포넌트를 선언하는 방식에서 데코레이터를 붙여주는 방식으로 변경했습니다.

```ts caption="이젠 조금 더 직관적으로 선언할 수 있는 것 같습니다!" {1}#add
@DefineComponent()
class Color extends Component<{ color: string }> {
  template() {
    return html`<button>${this.state.color}</button>`;
  }

  protected onRender(): void {
    this.target()!.addEventListener('click', () => this.changeColor());
  }

  changeColor() {
    this.state.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}
```

이제 @DefineComponent 데코레이터를 사용하여 컴포넌트를 선언할 수 있으며, 보다 직관적이고 간결하게 표현됩니다.

### `@On()`

이벤트 리스너를 메서드에 직접 등록할 수 있도록 @On() 데코레이터도 도입했습니다.

```ts {11}#add {7-9}#rm
@DefineComponent()
class Color extends Component<{ color: string }> {
  template() {
    return html`<button>${this.state.color}</button>`;
  }

  protected onRender(): void {
    this.target()!.addEventListener('click', () => this.changeColor());
  }

  @On('click')
  changeColor() {
    this.state.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}
```

이제 `onRender()` 내부에서 이벤트 리스너를 선언하지 않고, `@On()` 데코레이터를 통해 이벤트를 간단하게 등록할 수 있습니다. 이로 인해 이벤트 핸들러를 더 직관적이고 명시적으로 관리할 수 있습니다.

`@On()` 데코레이터는 첫번째 인자로 이벤트 타입, 두번째 인자로 선택자를 받을 수 있습니다. 선택자를 지정하면 컴포넌트 내부에서 해당 선택자를 타겟으로 이벤트 핸들러를 등록합니다.

```ts caption="각각 선택자를 통해서 이벤트를 달아줄 수 있습니다."
@DefineComponent()
class ColorList extends Component {
  template() {
    return html`<div>
      <button class="red">red</button>
      <button class="orange">orange</button>
      <button class="green">green</button>
    </div>`;
  }

  @On('click', '.red')
  clickRed() {
    console.log('red');
  }

  @On('click', '.orange')
  clickOrange() {
    console.log('orange');
  }

  @On('click', '.green')
  clickGreen() {
    console.log('green');
  }
}
```

![](https://i.imgur.com/C3GBDJ7.gif)

### Root로 이벤트 위임하기

`@On()` 데코레이터로 선언한 이벤트들은 각 컴포넌트에 이벤트 리스너를 연결하지 않고, `Root.create()`로 만든 진입점에서 관리합니다.

이를 통해 리액트와 비슷한 방식으로, 앱 전역에서 이벤트를 하나의 리스너로 처리합니다. 이는 성능 최적화에 유리할 수 있습니다.

![](https://i.imgur.com/I07oPOt.png)

물론! 모든 이벤트를 Root에서 관리하는 것이 성능 측면에서 이점이 있을지, 아니면 각 컴포넌트에서 개별적으로 이벤트 리스너를 달아주는 방식이 더 나을지는 실제 성능을 추적해보면서 결정해야할 문제인 것 같습니다.

데코레이터를 통해서 기본 컴포넌트를 추가적으로 개선해보면서 (만들다보니 mini rune가 되어버렸네요...) 코드의 직관성과 효율성이 크게 향상된 것 같습니다. 아직 구현하지 못한 기능들, (예를 들어 컴포넌트가 언마운트될 때 이벤트를 해제하는 등의 부분이 남아있지만), 이러한 환경을 직접 만들어가는 과정이 매우 의미 있는 경험이었습니다.

개발하는 동안 더 편리하고 유연한 설계의 중요성을 확실히 체감했습니다. 이를 바탕으로 앞으로는 프레임워크와 라이브러리 위에서도 확장 가능하고 관리하기 쉬운 코드를 작성하기 위해 더욱 노력할 것 같습니다.
