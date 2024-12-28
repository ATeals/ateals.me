---
title: Module Federation으로 런타임에 앱을 통합해보자
description: MFA의 구현 방법 중 하나인 Module Federation을 학습하면서 느낀 경험
image:
date: 2024-01-17T14:16:00
tags:
  - 프론트
  - MFA
  - Module_Federation
slug: doing-module-federation
---

저는 개발 아티클 읽는 것을 즐깁니다. 여러 아티클을 통해서 인사이트를 얻는 것도 있고, 새로운 개념을 알게 되기도 하기 때문입니다. *(개발 덕후라 글을 읽으면서 재밌기도 합니다 ㅎㅎ)*

[대형 웹 애플리케이션 Micro Frontends 전환기 (1) | 요즘IT](https://yozm.wishket.com/magazine/detail/2408/)

최근에 MFA를 통해 독립된 어플리케이션을 하나로 통합하는 글을 읽었습니다. 흥미로운 글이니 한번 읽어보시는 걸 추천드립니다. 물론 영상도 있습니다.

![흐음 잠깐만 이거…?](https://i.imgur.com/lvD9PE3.png)

위 글에서는 모듈 페더레이션을 통해 배포 단위가 나누어진 각각의 앱들을 런타임에 통합 로드하여 한가지 앱으로 렌더링하는 방식을 소개합니다. 각 Host, Remote(GNB, home)으로 나누어져 있는 것을 확인할 수 있습니다.

저는 이 글을 읽던 중 저의 레포에 적용해 볼 수 있는 방법을 생각했습니다. *(그게 지옥의 시작인 줄은 이제 알았지만요,,,)*

## 시작…..

저는 리액트 스터디를 진행하면서 간단한 어플리케이션들을 배포해봤습니다.

  <img src="https://i.imgur.com/B6BpRF2.png" />

  <img src="https://i.imgur.com/vd3iMKH.png" />

![](https://i.imgur.com/65Du2Wu.png)

각각 앱들은 각각에 레포에 별도로 배포가 되어 있었고, 저는 포트폴리오 사이트처럼 제가 만든 앱들을 한 페이지에서 보여줄 수 있는 방법을 고민하고 있었습니다.

뭔가 떠오르시지 않나요?

아까 제가 보여준 이미지를 다시 가져와 설명하자면 한 개의 host 어플리케이션에서 각각 배포한 React APP을 remote로 가져와 런타임에 한 가지 앱으로 만드는 방법을 떠올리게 되었습니다.

결과부터 말씀드리자면, 반쪽짜리 성공을 했지만 과정에서 느낀 점들이 많았기에 글로 남겨보려 합니다.

## Module Federation이란?

그렇다면 지금부터 사용할 Module Federation이 뭔지 부터 알아야 합니다.

> [\*Micro at buildtime, Monolith at runtime](https://youtu.be/XpeD4FtlMg4?t=2) - Zack Jackson\*

하나의 앱을 독립적인 배포가 가능한 모듈 단위로 나누어 브라우저 런타임에 통합하는 방법입니다. Module Federation이 MFA는 아니고, MFA의 구현 방법 중에 하나입니다.

Module Federation은 webpack에 종속 되어 있지 않습니다. 인터페이스에 가깝습니다. 빌드 툴에 따라 각각 다른 구현체가 존재합니다.

_Module Federation의 원리나 관련 된 용어는 너무 많고 간단히 다룰 수 없는 내용이니 글에서 따로 다루진 않겠습니다. 제가 참고한 참고 자료들을 읽어 보신다면 도움이 되실 것 같습니다._

### 사용 방법

저는 React APP을 Vite을 통해 빌드 했기 때문에  [vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)을 사용했습니다.

![](https://i.imgur.com/yHivR4H.gif)

> 모듈 페더레이션을 지원하는 Vite/Rollup 플러그인. Webpack에서 영감을 얻었으며[Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)과 호환됩니다.

> Using the Module Federation usually requires more than 2 projects, one as the host side and one as the remote side.

모듈 페더레이션을 사용하기 위해서는 2가지의 프로젝트가 필요합니다.

### Remote

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

Remote App에서 config 설정입니다. federation 플러그인에 설정을 해주시면 됩니다.

- name : App의 이름
- filename : 빌드 이후 번들 되는 매니페스트 파일입니다. 기본적으로 remoteEntry.js를 사용합니다.
- exposes : Remote에서 내보낼 요소
- shared : 의존성
  - host : remote에서 필요한 의존성을 포함해야 합니다.
  - remote : 자신이 필요로 하는 의존성을 포함해야 합니다.

_이 의존성 때문에…. 엄청 고생했습니다.._

### Host

```tsx
import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      remotes: {
        remoteApp: "<http://localhost:5001/assets/remoteEntry.js>",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

Host App에서도 똑같이 설정해주면 됩니다.

- remotes : 사용할 Remote 컨테이너를 설정합니다. remote의 이름과 해당 remote의 매니페스트 파일 경로를 설정해주면 됩니다.

### host/App

```tsx
import Button from "remoteApp/Button";

function App() {
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <Button />
    </div>
  );
}

export default App;
```

설정이 끝나고 두 앱이 빌드 된다면 host 앱에서 remote앱을 import해 사용할 수 있습니다. 물론 [React.lazy](https://react-ko.dev/reference/react/lazy#lazy) 를 이용해 지연 로드된 컴포넌트를 선언할 수 있습니다.

## 왜 Module Federation인가?

그렇다면 전 왜 Module Federation을 이용해 구현하려 했을까요? MFA를 구현하는 방법은 보다 여러가지가 있습니다.

- Server-side template Composition
- Build-time Integration
- Run-time Integration
  - iframes
  - web-components
  - javascript

저는 이미 GitHubs page에 정적으로 배포되어 있는 앱을 리모트로 가져오고 싶었습니다. 별도의 서버를 만들어 주어야 하는 Server-side template Composition는 일단 패스했습니다.

다음으로 Build-time Integration를 하려면 제가 미리 만들어 배포한 앱을 npm에 올리거나, host 로컬 모듈로 추가해야 합니다. 이는 앱이 늘어날 때마다 host앱의 build-time이 늘어나는 문제가 있습니다.

iframes을 사용하는 방법은 host app에 html 통째로 remote 앱을 통합하는 방법입니다. 이는 보안의 문제가 될 수도 있고 *(물론 지금 하는 건 간단한 프로젝트라 보안에 신경 쓸 필요는 없습니다.)*, 상태를 공유하게 된다면 window.postMessage(), EventListener와 같은 Web API를 사용해야 합니다. 이는 sideeffect를 통해 이용해야 하기 때문에 React에서 적절한 방법은 아니라고 생각했습니다.

위에서 언급한 문제들은 Module Federation을 이용해 Run-time Integration한다면 해결할 수 있습니다.

![](https://i.imgur.com/H7XwNrW.png)

분리하고 싶은 remote 컴포넌트를 별도의 배포 단위로 만들고, 해당 컴포넌트를 런타임에 독립된 번들로 통합시키는 겁니다. 이런 방식은 다음과 같은 장점을 가져갈 수 있습니다.

- React에서 제공하는 API나 전역 상태 관리 라이브러리를 이용해 host App에서 micro app으로 상태를 전달시켜줄 수 있습니다. *(즉 유저의 상태나 브라우저의 상태를 host app에서 micro app으로 전달하기 위해 별도의 Web API나 server를 통하지 않고 react component에서 하던 방식으로 전달이 가능합니다.)*
- 빌드 타임 통합이 아닌 런타임 통합이기 때문에 host, remote의 빌드 시간이 단축됩니다.
- 배포 단위를 유연하게 가져갈 수 있고, 한 개의 remote이 변경되더라도 전체를 변경하지 않고, remote 앱만 별도로 변경 후 빌드 할 수 있습니다. *(물론 대체도 가능합니다.)*

앞선 조사를 토대로 Module Federation을 이용해 포트폴리오 사이트를 만들고자 했습니다.

## 과정

저는 host App config를 다음과 같이 설정했습니다.

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

// <https://vitejs.dev/config/>
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host-app",
      remotes: {
        ReactMovie: "<https://ateals.github.io/react-movie/assets/remoteEntry.js>",
        Pomodoro: "<https://ateals.github.io/react-pomodoro/assets/remoteEntry.js>",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "framer-motion",
        "styled-components",
        "recoil",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

```tsx
const ReactMovie = lazy(() => import("RactMovie/App"));
const Pomodoro = lazy(() => import("Pomodoro/App"));

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element: <h1>hello!</h1> },
      {
        path: "/react-movie/*",
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <div>
              <ReactMovie />
            </div>
          </Suspense>
        ),
      },
      {
        path: "/react-pomodoro/*",
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <div>
              <Pomodoro />
            </div>
          </Suspense>
        ),
      },
    ],
  },

function App() {
  return (
    <div>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

이 후 각각의 basepath를 router path로 연결해 주고 lazy와 Suspense를 이용해 지연 로딩 해주었습니다.

다음과 같이 통합하는데 성공 했습니다만… 시도해보면서 여러가지 문제점들을 마주하면서 개발을 멈추었습니다.

![조잡하지만… 내 손으로 만든 MFA…..](https://i.imgur.com/BScEnsv.gif)

## 트러블 슈팅

개발을 하면서 여러 가지 문제가 발생해서 중단해야 했습니다. 해결한 부분도 있지만 여전히 미해결인 측면들도 존재하며, 높은 완성도를 위해서는 추가적으로 고려해야 할 다양한 요소들이 있기 때문에 개발 중단을 선택하게 되었습니다.

### 의존성

host와 remote에 의존성을 위해서 shared 옵션을 설정해 주던 것을 기억하시나요? 만약의 두 어플리케이션 의존성 라이브러리의 버전이 다르다면 어떨까요?

한 가지 예시를 들자면, react-movie 프로젝트에서는 react-query v4를 사용하고 있었고, host에 설치된 react-query는 v5가 설치되어 있었기 때문에 오류가 발생했습니다. v5부터는 useQuery와 그 외의 훅에서 객체 형식만 지원합니다.

따라서 모든 레포의 의존성 버전 통합을 해야 할 필요가 있었습니다….

### Provider

저는 host에서 별도의 remote앱을 떼어 내던 것이 아닌 이미 배포되어 있는 프로젝트를 remote로 해서 host를 구성했기 때문에 전역 상태나 Provider 이슈가 생겼습니다.

react-movie와 react-pomodoro 두 프로젝트 모두 styled-components 의 createGlobalStyle을 이용하고 있었기 때문에 페이지가 변경될 때마다 스타일이 달라지는 문제가 생겼습니다.

또한 각각의 remote는 react-router-dom에서 제공하는 RouteProvider를 이용하고 있었기 때문에 host에서 이를 그대로 불러오면 RouteProvier가 중첩되는 문제가 생겼습니다.

RouteProvider에 대해서는 여러 가지 해결책이 있겠지만 저는 기존 배포된 앱의 코드를 많이 수정하고 싶지 않았기 때문에

```tsx
const Remote = () => {
  return (
    <QueryProvider>
      <ThemeProvier>
        <ReactQueryDevtools initialIsOpen={true} />
        <Routes>
          <Route path={`${PATH.ROOT}`} element={<App />}>
            <Route path={`${PATH.DYNAMIC_MOVIS}`} element={<Movies />}>
              <Route path={`${PATH.DETAIL}/:id`} element={<MovieDetail />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvier>
    </QueryProvider>
  );
};

export default Remote;
```

Routes를 통해 라우트 해주는 별도의 컴포넌트를 만들어서 remote app을 구성했고 이를 expose해주었습니다.

### 경로 문제

눈썰미가 좋으신 분들이라면 위에서 보여드린 GIF에 react-movie 프로젝트의 logo를 불러오지 못하는 모습을 알 수 있습니다.

```tsx
<img src="/react-movie/images/logo.png" alt="logo" width="140" height="100">
```

해당 경로는 다음과 같은데 host 앱에서 다음 경로에는 logo.png가 없기 때문에 당연히 불러올 수 없습니다.

따라서 remote앱의 모든 assets 경로를 변경해 주어야 합니다.

```tsx
<img src={`${domainUrl}/react-movie/images/logo.png`} alt="logo" width="140" height="100">
```

### 원격 모듈 타입

아직까지 Module Federation을 통해 불러온 모듈의 타입을 알 수 있는 방법은 없습니다. remote 앱의 config를 확인하는 방법이 유일합니다.

![](https://i.imgur.com/YNgTjtn.png)

따라서 host에서 모듈의 타입을 별도로 정의해 주어야 합니다.

```tsx
//module.d.ts

declare module "Pomodoro/*";
declare module "ReactMovie/*";
```

## 마치며…

호기롭게 도전한 프로젝트는 일시정지하게 되었습니다. 아직 제가 알고 있는 지식이 부족하기도 하고, 이대로 개발하면 좋은 결과물이 나올 것 같지 않습니다. 하지만 이번 과정을 통해 알게 된 사실이 많습니다.

- Module Federation을 사용해 런타임에 remote 모듈을 가져올 수 있다. 이를 통해 MFA를 구현할 수 있다.
- MFA는 상태 관리를 더욱 신경써야 한다.
- 각각 컨테이너의 의존관계에 신경 써야 한다.

특히 멀티 레포를 Module Federation으로 통합하는 방법은 좋지 못한 개발 경험 *(모듈의 타입이라던지, 의존성, 상태관리등의 관리에서)* 을 가져다 주었고, 이는 왜 대규모 프로젝트에서 모노레포를 사용하는지 알게 해주었습니다.

모노레포의 장점인 통합 의존성 관리와 모듈의 재사용과 공유, Module Federation을 이용한 런타임 통합을 이용해 MFA를 구현한다면, 보다 좋은 개발 경험 아래에 좋은 결과물이 나올 것 같습니다.

다음에는 모노레포를 학습하고, 모노 레포를 통한 MFA를 구현해 보고 싶습니다.

## 참고자료

[대형 웹 애플리케이션 Micro Frontends 전환기 (1) | 요즘IT](https://yozm.wishket.com/magazine/detail/2408/)

[Webpack Module Federation 도입 전에 알아야 할 것들 | 카카오엔터테인먼트 FE 기술블로그](https://fe-developers.kakaoent.com/2022/220623-webpack-module-federation/)

[Module Federation의 컨셉과 작동 원리 이해하기](https://maxkim-j.github.io/posts/module-federation-concepts/)

[Vite + Module Federation 으로 Micro Frontends 경험해보기](https://velog.io/@ckstn0777/Vite-Module-Federation-%EC%9C%BC%EB%A1%9C-Micro-Frontends-%EA%B2%BD%ED%97%98%ED%95%B4%EB%B3%B4%EA%B8%B0#configuration-host-module-federation)
