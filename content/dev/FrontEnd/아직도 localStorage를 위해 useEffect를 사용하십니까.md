---
title: 아직도 localStorage를 위해 useEffect를 사용하십니까?
description: useSyncExternalStore 나왔는데 안 써볼 거야?
image:
date: 2023-09-10T14:35:00
tags:
  - React
slug: still-using-useEffect-for-localstorage
---

이번에 미뤄두었던 React의 기본을 위해서 공식 문서를 읽기 시작했다.

공식 문서를 천천히 읽어보니까 생각보다 내가 너무 많이 모르고 있었다는 생각을 하게 되었는데,

이번에 공식 문서를 읽으면서 알게 된 내용들이 너무 좋아서 포스팅해볼까 한다.

리액트 공식 문서에 대해서는 다른 글들도 많고, 아직 많이 못 읽어봤으니 추후에 쓰는 걸로 하고, 오늘은 **useSyncExternalStore** 이거에 대해 간단하게 사용해 본 글을 기록해 보려고 한다.

## You Might Not Need an Effect

---

[Effect가 필요하지 않을 수도 있습니다 – React](https://react-ko.dev/learn/you-might-not-need-an-effect)

리액트 공식 문서에 **Escape Hatches** 파트에서는 Effect를 대체하는 방법들을 여러가지 설명해준다.

예를 들어 data fetching을 위해 useEffect를 사용한다면, TanstackQuery와 같은 프레임워크의 빌트인 데이터 패칭 메커니즘을 이용하는 것을 권장한다. useEffect는 리액트의 탈출구이기 때문이다.

**Effect가 필요하지 않을 수도 있습니다.** 를 읽던 중 가장 흥미로웠던 부분은 Subscribing to an external store이다.

> 때로는 컴포넌트가 React state 외부의 일부 데이터를 구독해야 할 수도 있습니다. 서드파티 라이브러리나 브라우저 빌트인 API에서 데이터를 가져와야 할 수도 있습니다. 이 데이터는 React가 모르는 사이에 변경될 수도 있는데, 그럴 땐 수동으로 컴포넌트가 해당 데이터를 구독하도록 해야 합니다. 이 작업은 종종 Effect에서 수행합니다.

예를 들어 윈도우의 localStorage값을 React에서 이용한다고 하면, 나는 이렇게 코드를 작성할 것이다.

```tsx
const [storage, setStorage] = useState("");

useEffect(() => {
  const item = window.localStorage.getItem("storage");
  if (item) setStorage(item);
}, [storage]);
```

하지만 React v18부터는 외부 스토어 구독을 위해서 새로운 훅이 도입되었다.

바로  **useSyncExternalStore**다. 이 훅은 외부 스토어의 변경사항을 관찰하다가, 외부 스토어의 상태 변경이 발생하면, 재 렌더링을 시작한다.

```jsx
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

리액트 공식문서에서는 다음과 같이 설명한다.

> **subscribe**: 하나의 callback 인수를 받아 스토어를 구독하는 함수입니다. 스토어가 변경되면 제공된 callback을 호출해야 합니다. 이로부터 컴포넌트가 리렌더링 됩니다. **subscribe** 함수는 구독을 해제하는 함수를 반환해야 합니다.

**getSnapshot**: 컴포넌트에 필요한 스토어 데이터의 스냅샷을 반환하는 함수입니다. 스토어가 변경되지 않은 상태에서 **getSnapshot**을 반복적으로 호출하면 동일한 값을 반환해야 합니다. 저장소가 변경되어 반환된 값이 ([Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교시) 달라지면, React는 컴포넌트를 리렌더링 합니다.

**선택적** **getServerSnapshot**: 스토어에 있는 데이터의 초기 스냅샷을 반환하는 함수입니다. 오직 서버에서 렌더링할 때와 이를 클라이언트에서 hydrate하는 동안에만 사용됩니다. 서버 스냅샷은 클라이언트와 서버 간에 동일해야 하며, 일반적으로 서버에서 직렬화하여 클라이언트로 전달합니다. 이 함수가 제공되지 않으면 서버에서 컴포넌트를 렌더링할 때 오류가 발생합니다.

## 사용해보자!

---

내가 이번에 LocalStorage에 접근하기 위해 작성한 코드를 가지고 설명하겠다.

```jsx
import { useSyncExternalStore } from "react";

function useLocalStorage(key: string): [string | null, (value: string) => void] {
    const subscribe = (listener: () => void) => {
        window.addEventListener("storage", listener);
        return () => window.removeEventListener("storage", listener);
    };

    const getSnapShot = (): string | null => {
        return window.localStorage.getItem(key);
    };

    const setLocalStorage = (value: string): void => {
        window.localStorage.setItem(key, value);
        window.dispatchEvent(new StorageEvent("storage"));
    };

    return [useSyncExternalStore(subscribe, getSnapShot), setLocalStorage];
}

export default useLocalStorage;
```

내 useLocalStorage 훅은 localStorage의 value와 value를 변경하는 함수를 반환한다.

**useSyncExternalStore**에는 매개변수로 **subscribe**와 **getSnapShot** 두 가지를 보내주었다.

### getSnapShot

```jsx
 const getSnapShot = (): string | null => {
        return window.localStorage.getItem(key);
    };
```

컴포넌트에서 사용하는 스토어의 데이터 스냅샷을 반환하는 함수이다. 만일 스토어가 변경되지 않는다면, getSnapShot은 항상 동일한 값을 반환해야 한다.

값이 변경된다면, React는 리 랜더링을 한다.

나는 localStorage 값을 사용할 것이기 때문에 이를 반환해 주었다.

### subscribe

---

```jsx
const subscribe = (listener: () => void) => {
        window.addEventListener("storage", listener);
        return () => window.removeEventListener("storage", listener);
    };
```

callback을 인수로 받아 스토어를 구독한다.

스토어가 변경되면 제공된 callback을 호출해야 한다. 이로부터 컴포넌트 리 랜더링을 할지 말지 결정한다.

subscribe는 구독을 해지하는 함수를 반환해야 한다.

나는 localStorage 변경 여부를 확인할 것이기 때문에 window 이벤트의 storage 이벤트를 이용했다.

### setLocalStorage

---

```jsx
 const setLocalStorage = (value: string): void => {
        window.localStorage.setItem(key, value);
        window.dispatchEvent(new StorageEvent("storage"));
    };
```

이건 내가 구독하는 localStorage의 값을 변경하는 코드인데, 잘 보면 setItem뿐 아니라, 이벤트를 발생시키는 구문이 있는 걸 확인할 수 있다.

이는 윈도우의 storage 이벤트의 특성 때문이다.

> [!WARNING] WARNING
> 이 기능은 변경을 수행하는 동일한 페이지에서는 작동하지 않으며, 스토리지를 사용하는 도메인의 다른 페이지가 변경 사항을 동기화하기 위한 방법입니다. 다른 도메인의 페이지는 동일한 저장소 개체에 액세스할 수 없습니다.

## 후기

---

useSyncExternalStore를 사용하는 이유는 리액트 18의 동시성에서 발생하는 Tearing 현상 때문이라고 한다. (이는 아직 공부 중이므로 추후에 글로 작성할 거라고 생각한다….)

[useSyncExternalStore 어후 이름이 너무 길어.](https://velog.io/@jay/useSyncExternalStore)

![만든 커스텀 훅으로 다크모드를 구현해보았다!!!](https://i.imgur.com/z3fdTSg.gif)

아직은 사용해 봤다 수준이기 때문에 리액트 공식 문서를 찬찬히 읽으면서 더 이해해서 이론적인 부분도 포스트로 작성해 보겠다.
