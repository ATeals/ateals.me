---
title: Github Action을 이용한 모노레포 라이브러리 문서 자동화
description: 모노레포에서 개발하는 모듈의 문서를 자동화 해보자
date: 2024-03-13T14:07:00
slug: automating-docs-with-github-actions
---

최근에 [**Slash 라이브러리**](https://slash.page/ko/)를 가득 참고해서 모노레포를 통해 공부도 할 겸 나만의 라이브러리 만들기에 도전하고 있습니다.

토스의 Slash 라이브러리를 보면 라이브러리를 사용하기 편하게 문서 페이지를 제공하고 있습니다. 저도 이번에 저의 모노 레포의 문서를 제공해 보자라는 취지로 toss 라이브러리를 톺아보고 유사하게 만들어 봤습니다.

![완성된 페이지의 모습](https://i.imgur.com/SFZQgOP.png)

## 시작

저의 모노레포의 workspace는 다음과 같이 구성되어 있습니다.

```tsx
├── app // 아직 사용안함
├── packages
│   ├── react-design-system // 개인 프로젝트로 사용할 디자인 시스템
│   ├── react-shared // 리액트에 의존한 유틸
│   │   ...
│   └── typescript-utils // 타입스크립트로 만들어진 유틸 함수
└── docs // 문서 배포를 위한 workspace
```

Slash 라이브러리와 마찬가지로 Markdown 파일을 통해 문서 페이지를 만들기로 결정했습니다.

## 설계

처음에는 새로운 workspace를 생성해 문서를 위한 프로젝트를 구현하는 방법을 생각했습니다. 하지만 이 방법에는 많은 단점이 있었습니다.

Markdown 파일도 결국 유지 보수해야 하는 리소스에 포함되기 때문에 최대한 관련 코드와 붙어있어야 리팩터링에 용이합니다. 코드와 문서의 거리가 멀어지면 현재 버전의 코드와 문서가 불 일치하는 치명적인 문제가 발생할 수 있습니다.

또한, 처음부터 구현하는 방법은 투여해야 하는 리소스가 매우 높아집니다. 이는 배보다 배꼽이 더 커지는 느낌을 받았고, 관리해야 하는 부분이 늘어난다고 생각했습니다. *시간은 금이니까요!*

따라서 저는 탬플릿을 이용해 문서를 생성해 주는 도구를 사용하고, 각 문서는 최대한 코드와 인접하게 관리하며 배포 시 한곳에 모아서 배포한다는 기준을 생각했습니다. 또한 테스트 코드도 작성하고 있었고, 이미 디자인 시스템도 Github Action을 통해 자동으로 배포하고 있었기 때문에 문서 또한 해당 workspace의 test 이후 자동으로 배포되도록 구현하고자 했습니다.

요구 사항을 만족하기 위해 제가 생각한 ci/cd flow는 다음과 같습니다.

- 해당 workspace의 작업을 진행하는 branch에서 main으로 push한다.
- workspace의 test를 실행하고 성공하면 merge한다.
- merge되면 docs폴더 내부에 각 workspace에 존재하는 markdown 파일들을 복사해 가져와 빌드하고 배포한다.

## docusaurus

문서 페이지를 간단하게 page로 만들기 위해서 저는 docusaurus를 사용했습니다.

> [Docusaurus](https://github.com/facebook/docusaurus)는 페이스북 오픈소스 커뮤니티에서 관리하는 리액트 기반 문서 웹사이트 생성 도구이다.

Docusaurus는 Markdown뿐만 아니라 [MDX](https://mdxjs.com/) 형식으로 문서와 블로그 포스트를 쉽게 작성하고, 이를 웹사이트로 퍼블리싱할 수 있다.

> 🚨 docusaurus를 정말 찍먹한 수준이기 때문에 부정확한 정보가 포함되어 있을 수 있습니다.

간단하게 docusaurus를 선택한 이유를 설명하자면, markdown을 손쉽게 page로 전환해 주고 폴더와 파일을 통해 직관적으로 문서를 만들어주면서, config 파일을 통해 layout을 쉽게 잡아줄 수 있기 때문에 선택했습니다.

_slash 라이브러리에서도 docusaurus를 사용하고 있고, 리액트 기반이기 때문에 부담이 없었습니다._

docusaurus 공식문서를 보시면 쉽게 시작할 수 있는 cli 명령어를 지원합니다.

```tsx
npx create-docusaurus@latest my-website classic --typescript
```

명령어를 실행하면 다음과 같은 workspace가 자동으로 생성됩니다.

```tsx
my-website
├── blog
│   ├── 2019-05-28-hola.md
│   ├── 2019-05-29-hello-world.md
│   └── 2020-05-30-welcome.md
├── docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   └── mdx.md
├── src
│   ├── css
│   │   └── custom.css
│   └── pages
│       ├── styles.module.css
│       └── index.js
├── static
│   └── img
├── docusaurus.config.js
├── package.json
├── README.md
├── sidebars.js
└── yarn.lock
```

폴더 구조를 보시면 구조가 매우 직관적인 것을 알 수 있습니다.

각 폴더 (blog, docs)가 각각의 페이지를 포함하고, 내부에 md 문서를 통해 페이지를 생성해 주는 것을 확인할 수 있습니다.

![직관적이죠?](https://i.imgur.com/iW8fagT.png)

모노레포의 폴더 구조 그대로 markdown 파일을 docs workspace의 내부에 복사해 준다면 저장소의 구조와 같은 구조의 문서를 생성할 수 있습니다.

## script

따라서 저는 docs 내부에 scripts 폴더를 만들어 workspace의 md 파일을 복사해 docs 폴더 내부에 생성해 주는 스크립트를 typescrip를 이용해 작성하고 ts-node를 통해 실행시켰습니다.

```tsx
./docs/scripts/generateDocsFromMD.ts

import * as fse from "fs-extra";
import globby from "globby";
import path from "path";
import { DOCS_ROOT, PACKAGES_ROOT } from "./const";

export async function generateDocsFromMD() {
  console.log("⚙️ Generating docs from MD...");

  return await Promise.all([copyMDDocs(DOCS_ROOT, ["'**/*.md"])]);
}

async function copyMDDocs(outdir: string, exclude: string[]) {
  const filepaths = (
    await globby("**/*.md", {
      cwd: PACKAGES_ROOT,
      ignore: exclude,
    })
  ).filter((path) => !path.includes("node_modules")); // node_modules를 제외한 폴더 내부에 md 파일을 전부 불러옵니다.

  console.log("filepaths", filepaths);

  await Promise.all(
    filepaths.map(async (filepath) => {
      const source = path.join(PACKAGES_ROOT, filepath);
      const destination = path.join(outdir, filepath.replace("src/", ""));

      console.log("outdir:", destination);
      await fse.ensureDir(path.dirname(destination));
      await fse.copy(source, destination);
    })
  ); // ./docs/docs 폴더에 복사합니다.

  console.log("✅ Copied MD docs to", outdir);
}

```

이후 package.json 파일에 빌드 이전에 해당 script를 실행하도록 명령어를 구성했습니다.

```tsx
"scripts": {
    "docs": "rm -rf docs && ts-node ./scripts/index.ts && docusaurus build"
  },
```

저는 모노레포 도구로 turborepo를 사용하고 있었기 때문에 root의 turbo.json 파일에 pipeline을 설정해 줬습니다.

## Github Action

이후 Github Action을 위한 yml 파일을 작성해 줬습니다.

```yaml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build docs
        run: pnpm run docs

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: "./docs/build"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

main에 push가 트리거 되면 문서를 만들어 Github Pages에 배포 되도록 설정했습니다.

test를 위한 GitHub action 파일은 paths를 이용해 workspace마다 따로 설정해 해당 workspace의 코드가 main에 push 되면 실행될 수 있도록 만들었습니다.

```yaml
name: Typescript-Utils Test and Auto Merge

on:
  pull_request:
    branches:
      - main
    paths:
      - "packages/typescript-utils/src/**" # paths를 통해 해당하는 workspace에서만 실행합니다.
  push:
    branches:
      - main
    paths:
      - "packages/typescript-utils/src/**"

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    # To use Remote Caching, uncomment the next lines and follow the steps below.
    # env:
    #  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    #  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      # - name: Build
      #   run: pnpm build

      - name: Test
        run: pnpm test --filter=@repo/typescript-utils # --filter 옵션을 사용하면 해당 workspace에서만 명령어를 수행할 수 있습니다.
```

## 완성!

결과적으로 제가 생각한 flow로 작업을 할 수 있게 되었습니다. 더 이상 문서를 위해 따로 리액트 프로젝트를 만들거나 코드 작성 이후 문서를 추가적으로 작업할 필요 없이 코드를 작업한 위치에 markdown 파일을 만들어 문서를 작성하면 모듈을 Github main brunch에 pr이나 push 할때 자동으로 병합해 문서 페이지로 배포됩니다.

![](https://i.imgur.com/DPCXSD7.png)

[React Design System | My Site](https://ateals.github.io/frontend-monorepo/docs/react-design-system)
