---
title: 블로그 ISR 도입기
description: 
image: 
date: 2023-08-19T14:40:00
draft: 
tags:
  - Nextjs
  - 블로그
type: post
---

이번에 블로그를 다시 만들었다… 

[_다시 만들었던 블로그도 레거시가 되었다.._](https://ateals.vercel.app/)

이번 블로그의 가장 큰 핵심은 글을 발행할 때 재배포 하지 않도록 DB나 CMS를 이용해 실시간으로 블로그에 글을 업로드 하는 것과 마음에 들지 않는 블로그 디자인을 수정하는 것이다. _(디자인이 젤 어려워…)_

DB를 이용하기에는 DB 클라우드 서비스를 이용해서 사용해야 하기 때문에 작업량이 많아질 것 같아서 전부터 봐왔던 Notion Api를 이용했다.

Notion을 이용해서 실시간으로 노션에서 새 글을 발행할 때마다 서버를 재배포하지 않고, 실시간으로 글을 발행할 수 있게 되었다.

이 과정에서 그동안 봐왔던 Next.js의 ISR을 사용하게 되었는데 이렇게 글로 남기게 되었다.

## 야심찬 시작, 실시간 글 발행

---

처음엔 단순히 노션에서 지원하는 Javascript SDK를 이용해서 개발했다.

역시 추상화되어 있는 SDK는 사용하기 편했고, Next.js의 SSR을 이용해서, 페이지 요청을 보낼 때 마다. 글을 불러와 MarkDown으로 만들어서 페이지에 표시해 주었다. 응답까지 대기 시간이 발생하기 때문에 Skeleton Ui를 구현해서 사용자가 로딩 중 임을 인식할 수 있게 만들었다.

![](https://i.imgur.com/A7tJ7yu.gif)

블로그를 만들고 포스트를 올리던 중 느낀 점은 내가 이전의 봤던 페이지도 다시 불러올 때마다 기다려야 한다는 점이었다. 그렇다고 페이지를 SSG로 만들자니 글을 수정할 때마다 재배포 해야 했기 때문에 원점으로 돌아가게 된다.

그러던 중 Next의 ISR이 떠오르게 되었다. 바로 적용해 보자!

## 그래서 ISR이 뭔데

---

Next.js 공식 문서에서는 ISR을 다음과 같이 설명하고 있다.

> **ISR(Incremental Static Regeneration)을 사용하면 전체 사이트를 재 구축할 필요 없이** 페이지별로 정적 생성을 사용할 수 있습니다 . ISR을 사용하면 정적의 이점을 유지하면서 수백만 페이지로 확장할 수 있습니다.

즉 정적으로 만들어 놓은 페이지 들도 필요시 업데이트할 수 있다는 것이다.


> [!info] Next 공식 문서에서 말하는 장점은 다음과 같다.
> **더 나은 성능:** ISR을 통해 Vercel이 [글로벌 에지 네트워크의](https://vercel.com/docs/edge-network/overview) 모든 지역에서 생성된 페이지를 캐시 하고 파일을 내구성 있는 스토리지에 유지할 수 있으므로 정적 페이지는 일관되게 빠를 수 있습니다.
> 
**백엔드 로드 감소:** ISR은 캐시 된 콘텐츠를 사용하여 데이터 소스에 대한 요청을 줄임으로써 백엔드 로드를 줄이는 데 도움이 됩니다. 
>
>**더 빠른 빌드:** 페이지는 방문자가 요청할 때 또는 빌드 중이 아니라 API를 통해 생성될 수 있으므로 애플리케이션이 커짐에 따라 빌드 시간을 단축할 수 있습니다.


Next의 ISR 구현 방식은 현재 2가지가 있다.

### Time-based Revalidation

---

**Time-based Revalidation (시간 기반 재검증**)은 요청에 ravalidate Time을 설정해 일정 시간이 지난 후, 데이터를 재검증하는 방법이다.

![](https://i.imgur.com/u41jpRW.png)

그림을 보면, 첫 번째 요청에서 cache가 없으므로 Data Source에 접근해서 응답 결과를 반환한다.

그다음 같은 요청을 보내면, cache에서 응답 결과를 반환한다.

이때 미리 지정해 둔 revalidate가 만료되면, 다음과 같이 작동한다.

- 백그라운드에서 데이터 재검증을 시작한다.
- 데이터를 성공적으로 가져오면 Next.js는 새로운 데이터로 cache를 업데이트한다.
- 재검증이 실패하면 이전 데이터가 변경되지 않은 상태로 유지된다.

### On-Demand Revalidation

---

**On-Demand Revalidation(온디맨드 재검증)** 은 **revalidatePath()** 혹은 **revalidateTag()** 를 이용하여 요청을 재검증 한다.

**revalidatePath()** 는 페이지의 경로 기반으로 재검증하는 방식이고, **revalidateTag()** 는 ****fetch요청시 option으로 보내준 tag를 기반으로 재검증하는 방식이다.

![](https://i.imgur.com/Av5RjIW.png)

사진은 **revalidateTag()** 를 사용한 예시를 보여준다. 첫번째 요청에서 tags를 포함해 요청을 보내주면, Data Source의 데이터를 가져와 cache에 저장한다.

이후 **revalidateTag()** 를 이용해 트리거 해주면, 트리거의 tag와 같은 **tag를** 가진 요청들이 캐시에서 제거된다. 다음에 같은 요청을 보내면, cache가 miss되어 다시 Data Source의 데이터를 가져와 cache에 저장한다.

**Time-based Revalidation (시간 기반 재검증**) 은 데이터가 자주 변경되지 않고 신선도가 그다지 중요하지 않은 데이터에 유용하다. **On-Demand Revalidation(온디맨드 재검증)** 은 가능한 한 빠르게 최신데이터를 표시하는 경우에 유용하다.

나는 블로그의 포스트가 최신화 되었을 때 데이터를 재검증 해주고 싶기 때문에, **On-Demand Revalidation(온디맨드 재검증)** 을 이용했다.

_(공식문서도 친절하게 On-Demand방식의 예시로 CMS 콘텐츠 업데이트를 들고 있다…)_

## 코딩 시작

---

나는 ISR의 **revalidateTag()**를 이용했는데**, Tag**를 이용한 이유는 단일 **path**로 최신화하는 것보다 **tag**로 직접 내가 그룹을 묶어서 캐시를 지워줄 수 있다고 생각했기 때문이다.

다는 두 가지 종류의 태그를 만들었다. 첫 번째는 글의 목록을 fetch 하는 “series” 두 번째는 글의 각각 id 값을 이용해서 글마다 최신화 상태에 대한 tag를 만들었다.

그렇다면 포스트 내용에 ISR을 적용한 코드를 보자

_(이번 포스트는 ISR에 대한 내용이기 때문에 다른 코드는 참고로만 봐두자, 블로그 개발기는 시리즈로 계속 포스트 하겠다.)_

이것은 내 글 본문을 만드는 코드다.

```tsx
// app/post/[postId]/_components/PostBody.tsx

export default async ({ postId }: { postId: string }) => {
    const post = await notionPostData(postId);

    return (
        <section className="flex justify-center">
            <section className="w-full dark:prose-invert prose prose-md prose-hr:mt-5 p-5 prose-headings:mt-10 prose-blockquote:border-l-deepblue prose-a:no-underline">
                <MDXComponent source={post} />
            </section>
        </section>
    );
};
```

**notionPostData()** 에 글의 id인 postId 파라미터를 보내주면 postId와 같은 notion의 글 내용을 불러와 MarkDown String으로 변환해 준다. _(이후 MDXComponent에서 source로 받은 문자열을 HTML로 렌더링 해준다.)_

**notionPostData()** 에서 Data fetching 해주는 코드는 다음과 같다.

```tsx
const res = await (
        await fetch(url, {
            method: "GET",
            headers: { accept: "application/json", "Notion-Version": "2022-06-28", Authorization: `Bearer ${process.env.NOTION_KEY}` },
            next: { revalidate: false, tags: [id] },
        })
    ).json();
```

Next.js의 확장된 fetch 옵션에 next에서 제공하는 옵션을 지정해 줬다.

```jsx
next: { revalidate: false, tags: [id] },
```

revalidate의 type으로는 false 와 number 가 있다.

false는 말 그대로 데이터를 자동으로 재 검증하지 않는 것이다.

number를 넣어주면, next는 number(초) 이후에 발생하는 같은 요청에 revalidate 트리거를 실행한다.

나는 포스트를 직접 트리거 하지 않을 때는 정적 페이지로 이용할 생각이기 때문에 false를 사용했다.

Next.js에서 tags는 배열로 받는다. 즉, 트리거 될 태그를 여러 개 지정해 줄 수 있다.

나는 tags에 post의 id를 지정해 주었다. 이렇게 하면 각각의 포스트가 최신화되었을 때 전체 포스트를 갱신하는 게 아니라 변경된 포스트의 cache만 을 지정해서 지워줄 수 있다.

이렇게 data fetching 설정을 마치고 나면, 트리거를 할 수 있도록 코드를 작성해야 한다.

Next에서  **RevalidatePath()** 혹은 **RevalidateTag()을** 이용하기 위해서는 **Sever Action**을 이용하거나 직접 **API**를 만들어주는 방법을 사용해야 한다.

나는 직접 API를 만드는 방식을 이용했다.

```tsx
//app/api/revalidate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get("tag");
    const secret = request.nextUrl.searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    if (!tag) return NextResponse.json({ message: "no Tag" }, { status: 401 });

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now(), message: "새로고침 성공" });
}
```

코드는 Next 공식 문서를 이용해서 작성했다.

해당 API는 Endpoint에 tag와 secret을 params로 받는다.

secret은 미리 지정해 둔 암호를 이용해서 무분별한 새로고침을 방지하기 위해 넣었다.

_(지금은 임시방편으로 단순 문자열을 사용하고 있는데, 이런저런 블로그의 기능이 추가되면 변경해 보겠다.)_

tag가 없거나 secret이 다를 경우에는 early return을 이용해서 트리거 되지 않게 만들었다.

요청이 오면 해당 tag를 이용해 tag의 cache를 제거하고, 이후 요청에 새로운 cache를 생성하게 된다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0514f638-f0d3-4f3e-a08e-2f868498d1f7/Untitled.png)

이렇게 블로그에 해당 API 요청을 보내주는 버튼을 만들어서 글이 최신화되면, 눌러 트리거 되게 만들었다.

## 마치며

---

당연한 이야기지만 SSR을 이용했을 때와 ISR을 이용했을 때의 속도 차이는 분명했다.


![_(와우 ISR 만세!)_](https://i.imgur.com/gmit60g.gif)



이번에 블로그에 ISR을 도입하면서, Next의 ISR을 좀 더 잘 알게 되었고, 조금이나마 블로그 성능 개선도 할 수 있던 좋은 경험이었다.

역시 실제로 개발을 진행하면서 발생하는 문제를 해결하는 과정에서 얻는 경험과 지식이 책으로만 얻는 것보다 값진 것 같다. (물론 그렇다고 책으로 얻는 지식이 별로라는 말이 아니다.)

이번에 테스트하면서 알게 된 내용과 고민해 봐야 할 문제들이 생겼다.

1. 노션에서 글이 최신화되었을 때 따로 버튼을 누르지 않고 트리거 되도록 만들기 이건 내가 직접 서버와 DB를 이용한다면, DB를 최신화하는 과정에서 트리거 하는 API에 요청을 보내주면 되는 데, 지금은 notion을 CMS로 이용하고 있기 때문에 고민을 해봐야겠다.
2. 현재 노션에서 블록이 많은 글을 불러올 때 속도가 너무 느리다. 지금 내 블로그에서 글 본문을 불러오는 방식은 글의 모든 블록을 가져온 다음 Markdown으로 변환하고, 렌더링하는 방식이다. 블록이 너무 많으면, 변환하는 과정에서 사용자는 긴 로딩 시간을 겪게 되는데, 블록을 각각의 작은 블록으로 만들어서 조금씩 렌더링 하는 방식을 생각해 봐야겠다.

_(블로그 포스트는 걱정 안 해도 될 것 같다… 블로그도 만들고 개발 포스트도 만들고 1석 2조….)_

# 참고 자료

---

[***](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)[https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation***](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation***)

[***](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)[https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)***

# +

---

이렇게 사용하다보니 찾게된 버그가 있었는 데, notion Api로 이미지를 받아오면 해당 이미지주소의 만료기한이 생긴다. 내 블로그는 ISR을 이용하고 있음으로, 이미지가 만료되면, 최신화 하지 못하고, 만료된 이미지를 가지고 있는다…

그래서 차선책으로 이미지를 받아올 때 만료기간을 확인하고, 만료된 이미지라면 새로 fetch하도록 적용해 주었다.

```jsx
n2m.setCustomTransformer("image", async (block) => {
    let { image } = block as any;

    if (!image?.file) return false;

    if (new Date(image?.file?.expiry_time) < new Date()) {
        const res = await (
            await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
                method: "GET",
                headers: { accept: "application/json", "Notion-Version": "2022-06-28", Authorization: `Bearer ${process.env.NOTION_KEY}` },
                next: { revalidate: 3600 },
            })
        ).json();

        image = res.image;
    }

    return `<div className="flex flex-col items-center my-10">
    <img loading="lazy" className="m-0" src="${image?.file?.url || image?.external?.url || ""}" alt="image" />
    <span className="text-[gray] italic">${image?.caption[0]?.text?.content === undefined ? "" : image?.caption[0]?.text?.content}</span>
    </div>`;
});
```

이제 이미지에 존재하는 expiry_time과 현재시간을 비교해서 최신 이미지를 가져오게 되었다!!

노션에서 제공하는 url의 만료기간이 1시간 정도이므로 fetch의 revalidate time도 1시간으로 설정해 주었다.

얏호!