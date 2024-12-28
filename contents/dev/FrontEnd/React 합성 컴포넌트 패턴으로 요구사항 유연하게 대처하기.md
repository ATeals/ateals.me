---
title: React 합성 컴포넌트 패턴으로 요구사항 유연하게 대처하기
description: Compound Component Pattern으로 재사용성이 높고 효율적인 컴포넌트를 만들어보자
image:
date: 2024-01-01T14:28:00
tags:
  - 프론트
  - React
slug: using-ccp
---

노마드 코더에서는 리액트 10주 스터디의 마지막 졸업작품으로 간단한 SNS를 만들어보는 과제가 진행됩니다. 학교 시험 기간과 졸업 과제 기간이 겹쳐 제가 이상적으로 생각하는 코드 품질이 나오지 않았고, 학교를 종강하고 리팩토링 목표들 중에서 가장 개선하고 싶었던 부분은 게시물을 관리하는 Post 컴포넌트였습니다.

## 기본 요구사항

![](https://i.imgur.com/RpDqBHz.png)

Post 컴포넌트 디자인

저의 SNS 프로젝트(이하 SNS라고 하겠습니다.)에서는 Post를 크게 header, body, footer로 나누었습니다.

### PostHeader

![](https://i.imgur.com/MXEmm4T.png)

포스트 작성자의 아바타, 이름, 게시물을 작성한 시간을 나타냅니다. Header를 클릭하면 User의 프로필을 확인할 수 있습니다.

### PostBody

![](https://i.imgur.com/2dGlfKr.png)

포스트의 본문과 포스트를 제어하는 버튼들을 나타냅니다. 포스트의 Body는 다음과 같은 요구사항이 있습니다.

- 미리 보기 타입의 포스트의 경우 본문을 요약하고, 본문 클릭 시 Post 상세페이지로 이동해야 합니다.
- 포스트의 작성, 수정, 댓글 작성에서는 body 대신에 editor를 이용할 수 있어야 합니다.
- 로그인한 사용자의 권한에 따라 제어 버튼을 변경해야 합니다.

### PostFooter

![](https://i.imgur.com/RbUpWSf.png)

포스트의 댓글 개수, 좋아요 개수를 나타냅니다.

이후 댓글과 좋아요 클릭 시 해당 사용자 리스트를 출력해야 합니다.

위의 요구사항을 구현하기 위해 저는 header, body, footer를 각각 컴포넌트로 만들었습니다.

## 초기 구현

```tsx
export const PostPreview ({ post, user }: { post: Post; user: User }) => {
  const {
    user: { name: ownerName, avatar: ownerAvatar, id: ownerId },
    body,
    id,
    childPosts,
    likes,
    updatedAt,
    depth,
  } = post;

  return (
    <div className="border-2 border-gray rounded-lg p-5">
      <Link href={`/user/${ownerId}`}>
        <PostHeader name={ownerName} avatar={ownerAvatar} timeLine={updatedAt?.toString()} />
      </Link>
      <Link href={`/user/${ownerId}/post/${id}`}>
        <PostBody children={body} className="h-[300px] overflow-hidden" />
      </Link>
      <div className="px-5 border-l-2 border-l-gray-300 mx-4 [&>*]:mx-2">
        {depth < 2 && (
          <LinkIcon defaultIcon={"bi bi-chat text-gray-500"} href={`/comment?parentPostId=${id}`} />
        )}
        <ButtonIcon
          defaultIcon={"bi bi-suit-heart text-gray-500"}
          onClick={(e) => console.log("like")}
          clickedIcon={"bi bi-suit-heart-fill text-red-500"}
          isClicked={likes?.some((like) => like.userId === user.id)}
        />
      </div>

      <PostFooter postId={id} comments={childPosts} likes={likes} />
    </div>
  );
};
```

_진짜…. 이게 코드….?_

이런 식으로 컴포넌트를 만들다 보니 다음과 같은 문제가 발생했습니다.

### Post의 요구사항마다 새로운 컴포넌트를 만들어야 했습니다.

요구사항 중 body의 요구사항마다, PostPreview, PostEditor, PostFull 등, PostHeader, PostBody, PostFooter를 조합한 새로운 컴포넌트들을 찍어 냈습니다.

만약 Post에 대한 요구사항이 N개씩 늘어날수록 저는 N개의 컴포넌트를 추가적으로 만들어야 하는 끔찍한 환경을 만들게 되었습니다.

### Post에서 알고 있을 필요 없는 user를 Porps로 받아야 합니다.

가만히 생각해 보면 이상적인 Post 컴포넌트는 그저 Post 데이터를 API에서 받아 그 내용을 화면에 뿌려주기만 하면 OK입니다.

하지만 현재 컴포넌트에서는 PostBody의 요구사항을 위해서 user 정보를 Prop으로 받을 수밖에 없었습니다.

```tsx
<ButtonIcon
  defaultIcon={"bi bi-suit-heart text-gray-500"}
  onClick={(e) => console.log("like")}
  clickedIcon={"bi bi-suit-heart-fill text-red-500"}
  isClicked={likes?.some((like) => like.userId === user.id)} //뜨악 포스트 내부에서 user 데이터를 사용합니다.
/>
```

_좋아요를 위한 버튼 컴포넌트에서 좋아요 상태를 확인하기 위해 세션 user의 id와 Post의 소유자 id를 Post 컴포넌트 내부에서 비교하고 있습니다. 이러한 구현은 Prop driling을 야기할 수 있고, 관심사 분리에도 실패한 코드라고 말할 수 있습니다._

### 새로운 요구사항이 생기면 큰 리팩토링 비용이 필요합니다.

N개의 요구사항에 따라 N개의 컴포넌트가 생기는 구조이고, N개의 컴포넌트는 각각 Header, body, footer에 종속적입니다. 이는 3개의 요소 중 한 개의 요소에 새로운 요구사항을 위한 prop이 필요하다면, N개의 컴포넌트에서도 수정이 필요합니다.

## 그렇다면 어떻게 해결해야 할까?

> React는 강력한 합성 모델을 가지고 있으며, 상속 대신 합성을 사용하여 컴포넌트 간에 코드를 재사용하는 것이 좋습니다.

이번 문서에서는 React를 처음 접한 개발자들이 종종 상속으로 인해 부딪히는 몇 가지 문제들과 합성을 통해 이러한 문제를 해결하는 방법을 살펴볼 것입니다.

-React 공식 문서-

컴포넌트를 작성하기 전에 다시 한번 공식 문서를 봤다면 얼마나 좋았을까요?

React에서는 이러한 합성 모델을 바탕으로 **Compound Component Pattern** 이 존재합니다. **Compound Component Pattern** 을 다루는 블로그는 많으니 여기서는 생략하겠습니다. 요약하자면, 합성 컴포넌트 패턴은 여러 개의 작은 서브 컴포넌트들이 각각의 역할을 하도록 하고, 이를 조립하여 하나의 큰 컴포넌트를 만드는 것이라고 할 수 있습니다.

합성 컴포넌트 패턴을 사용하면, 페이지에서 필요로 하는 서브 컴포넌트만 합성하여 사용할 수 있기 때문에, 개발자에게 자율성을 줄 수 있고, Props를 한 컴포넌트에서 전부 전달하지 않고, 서브 컴포넌트에 분배하기 때문에 관심사 분리와, Prop Driling을 방지할 수 있습니다.

물론 장점만 있는 건 아닙니다. 컴포넌트 합성에 자유도를 부여하는 만큼 사용처에서 의도대로 합성되지 않을 수도 있고, 합성 컴포넌트 패턴을 사용하지 않을 때보다, JSX의 길이가 길어질 수도 있습니다. 또한 상속을 사용한 일반 컴포넌트 보다 구현 복잡도가 증가하기도 합니다.

**Compound Component Pattern** 을 사용했을 때 장점이 현재의 Post컴포넌트의 문제점을 해결해 줄 수 있다고 판단해서 리팩토링을 진행하게 되었습니다.

## 리팩토링

### 시작하기 전에

합성 컴포넌트 패턴을 사용했을 때 필요한 기술이 있습니다. 바로 **Context API**입니다. React에서 제공하는 Context API를 사용하면, 각각 공통적으로 사용하는 상태를 서브 컴포넌트에 Prop으로 전달하는 것이 아닌 메인 컴포넌트에서 Context API를 이용해 메인 컴포넌트 내부에 children들이 공유 받을 수 있습니다.

### 메인 컴포넌트

```tsx
export const postContext = createContext<Post | undefined>(undefined);

export const Main = ({ children, post }: { post?: Post; children: React.ReactNode }) => {
  return (
    <postContext.Provider value={post}>
      <div className="border-2 border-gray rounded-lg p-5 min-w-[480px]">{children}</div>
    </postContext.Provider>
  );
};
```

Main 컴포넌트는 Post의 틀을 담당하고, Context API의 Provider를 이용하여 Prop으로 전달받은 post를 children의 서브 컴포넌트에 전달하는 역할을 합니다.

### PostHeader-리팩토링

```tsx
export const Header = ({ user }: { user?: User }) => {
  const post = useContext(postContext);

  const owner = post?.user;

  return (
    <div className="flex items-center justify-between group">
      <div className="flex">
        <Avatar src={post?.user.avatar || user?.avatar || DEFAULT_AVATAR} rounded={true} size="md" />
        <Title className="ml-5 group-hover:underline">{owner?.name || user?.name}</Title>
      </div>

      <div className="flex">
        {post?.createdAt && <Description>{elapsedTime(post.createdAt.toString())}</Description>}
      </div>
    </div>
  );
};
```

PostHeader에서는 useContext를 이용해 메인 컴포넌트에서 전달한 Post 데이터를 사용하여 Post의 Header를 그립니다. 또한 Prop으로 user를 전달하여 다음과 같은 상황에서 사용할 수 있습니다.

![게시물 작성](https://i.imgur.com/TzDAkki.png)

위에 보이는 화면은 게시글을 작성하는 컴포넌트입니다. 게시글 작성 컴포넌트에서는 아직 Post 데이터가 존재하지 않기 때문에 PostHeader에 Prop으로 세션에 존재하는 User를 전달해 사용할 수 있습니다.

_합성을 사용하지 않았을 때를 다시 생각해 볼까요? 아마 이와 같은 요구사항을 가진 N개의 컴포넌트에 CreatePostHeader와 같은 새로운 컴포넌트를 사용하거나, PostHeader 컴포넌트를 수정해야 했을 겁니다. 상상 만으로도 끔찍하네요…_

### PostBody-리팩토링

```tsx
export const Body = ({ className, children }: PostBodyProps) => {
  const post = useContext(postContext);
  return (
    <div className="m-4 p-2 mb-0 pb-0 pl-10 border-l-2 border-l-gray-300">
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children || post?.body}</ReactMarkdown>
      </div>
    </div>
  );
};
```

Body도 앞서 살펴본 Header 컴포넌트와 같이 구현할 수 있습니다.

children은 왜 필요할까요? 아까 본 게시글 생성 화면으로 돌아가 보겠습니다. 게시글 생성 컴포넌트에서는 마크다운으로 작성한 포스트를 미리 확인할 수 있는 기능을 지원합니다.

![게시물 미리보기](https://i.imgur.com/S7svnJB.png)

Body에 input에서 변경된 markdown을 children으로 받아 구현할 수 있게 되었습니다.

### Export

```tsx
export const Post = Object.assign(Main, {
  Body,
  Header,
  Footer,
  Editer,
  ModifierMenu,
  CommentButton,
  DeleteButton,
  UpdateButton,
});
```

이제 Post에서 사용하는 서브 컴포넌트들을 Object.assign을 이용해 묶어 주었습니다. 이를 통해서 Post 컴포넌트의 메인 컴포넌트와 서브 컴포넌트의 응집도를 높일 수 있습니다.

### 컴포넌트 합성

이렇게 만든 Post 컴포넌트를 사용해 보겠습니다.

```tsx
export const PostInfinityList = ({ user }: { user: User }) => {
  const { posts, pageCursor, fetchNextPage, isFetchingNextPage } = useInfinityPosts();
  const { bottomItemRef } = useIntersectionObserver(() => fetchNextPage());

  return (
    <div className="w-[70%] [&>*]:m-10">
      {posts?.map((post) => (
        <Post post={post} key={post.id}>
          <Post.Header />
          <Link href={`/user/${post.userId}/post/${post.id}`}>
            <Post.Body className="h-[300px] overflow-hidden" />
          </Link>
          <Post.ModifierMenu>
            <Post.CommentButton />

            {isUserLikePost({ user, post }) ? (
              <UnLikeButton userId={user.id} postId={post.id} />
            ) : (
              <LikeButton userId={user.id} postId={post.id} />
            )}
          </Post.ModifierMenu>
          <Post.Footer />
        </Post>
      ))}
      <div className="flex justify-center">
        {isFetchingNextPage ? <LoadingIndicator /> : pageCursor !== 0 && <div ref={bottomItemRef} />}
      </div>
    </div>
  );
};
```

PostInfinityList는 useInfinityPosts훅을 사용해 전체 포스트를 받아와 무한 스크롤로 보여주는 컴포넌트 입니다. 해당 컴포넌트 내부에서 Post컴포넌트를 사용하고 있는데요. 보시는 바와 같이 PostInfinityList에서 요구하는 대로 서브컴포넌트를 작성할 수 있습니다. 물론 각각에 서브컴포넌트에 prop을 전달할 필요 없이 메인 컴포넌트에서 post를 전달해 주면 됩니다.

![그렇게 완성된 컴포넌트의 모습](https://i.imgur.com/Ar8Xshv.png)

물론 요구사항이 다른 post는 각각의 페이지에서 서브컴포넌트를 수정하여 사용하면 됩니다.

![디테일 페이지에서는 Post body가 요약되지 않고 본문을 전부 포함한 상태로 보여집니다. 또한 세션의 유저와 포스트의 소유자를 비교하여 수정과 삭제를 위한 버튼을 제어합니다.](https://i.imgur.com/Rzyt7Rp.png)

```tsx
export default ({ post, user }: { post: PostType; user: User }) => {
  const { user: owner } = post;

  return (
    <Post post={post}>
      <Link href={`/user/${post.userId}`}>
        <Post.Header />
      </Link>
      <Post.Body className="min-h-[400px]" />
      <Post.ModifierMenu>
        <Post.CommentButton />
        {isUserLikePost({ user, post }) ? (
          <UnLikeButton userId={user.id} postId={post.id} />
        ) : (
          <LikeButton userId={user.id} postId={post.id} />
        )}
        {owner.id === user.id && (
          <>
            <Post.UpdateButton />
            <Post.DeleteButton />
          </>
        )}
      </Post.ModifierMenu>
      <Post.Footer />
    </Post>
  );
};
```

이런식으로 말이죠!

## 리마인드

자 그럼 지금까지 **Compound Component Pattern** 을 이용해 컴포넌트를 리팩토링 하면서 해결한 문제점과 얻게된 장점을 다시 한번 정리해보겠습니다.

### 유연한 요구사항 대처

_음… 미리 보기 타입의 포스트에서도 로그인 된 유저와 소유자를 비교해서 수정 삭제가 가능했으면 좋지 않을까?_

이젠 위와 같은 고민이 두렵지 않습니다. 그냥 해당 요구사항을 위한 서브컴포넌트를 추가하기만 하면 되거든요! 리팩토링에 필요한 시간이 단축되었습니다. 더 이상 UI에 해당하는 요구사항의 변화는 저의 앞길을 막을 수 없습니다.

### 관심사 분리

초기에 만든 Post 컴포넌트와 비교해서 이제는 Post 컴포넌트에서 필요하지 않은 관심사를 제거했습니다. 더 이상 Post는 로그인 된 유저와 Post의 소유자를 비교하는 작업 필요 없이 심플하게 Post에 대한 데이터를 화면에 그려주는 역할을 수행하고, 검증과 비교와 같은 작업을 페이지에서 진행할 수 있게 되었습니다.

이는 컴포넌트의 의도치 않은 문제점을 예방할 수 있고, 관심사에 따라 독립적인 컴포넌트를 만들 수 있습니다.

### Prop Driling 방지

이제 서브컴포넌트에 Prop을 전달해줄 필요도 없고 페이지를 위한 새로운 타입의 Post 컴포넌트를 만들 필요도 없습니다.

### 끝인가?

물론 리팩토링은 끝이 없습니다. 저의 post editor는 아직도 불완전한 상태이고, 예기치 않은 문제들이 동작할 가능성 있습니다. 고민중인 내용은 다음과 같습니다.

- Post를 메인 컴포넌트에 전달받지 못했을 경우 처리를 어디서 진행할 것인가.
- Post의 서브 컴포넌트의 영역을 어디까지 정의할 것인가. *현재 Like와 같은 동작은 별도의 컴포넌트로 관리하고 있습니다. 이를 Post의 서브컴포넌트로 넘겨줄지, 지금처럼 관리할지는 좀 더 고민해 봐야 하는 부분인 것 같습니다.*

위와 같은 고민은 뒤로하고, 작성된 컴포넌트는 매우 만족스럽습니다. 합성을 통해 재사용성이 높고, 독자적인 컴포넌트를 관리하기 위해 고민하는 경험은 매우 유익한 것 같습니다. 앞으로 추가적인 리팩토링이 끝나면 계속 포스팅할 계획입니다.

## 참고자료

[[React] 디자인 시스템에 Compound Component Pattern 적용해보기](https://iyu88.github.io//react/2023/03/25/react-compound-component-pattern.html)

[합성 컴포넌트로 재사용성 극대화하기 | 카카오엔터테인먼트 FE 기술블로그](https://fe-developers.kakaoent.com/2022/220731-composition-component/)
