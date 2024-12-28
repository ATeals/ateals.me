---
title: Effective Query Key
description: QueryFactory로 Query Options 효과적으로 재사용하기.
image:
icon: https://seeklogo.com/images/R/react-query-logo-1340EA4CE9-seeklogo.com.png
tags:
  - React
  - 네부캠
date: 2024-12-13T14:28
updated: 2024-12-13T18:09
series:
slug: effective-query-key
---

> 이 글은 Tanstack Query에 대해 어느정도 알고 있는 개발자를 타겟으로 작성하고 있습니다. 따라서 기본적인 Tanstack Query 사용법을 서술하지 않습니다.

우리는 서버의 상태를 관리하기 위해 Tanstack Query를 사용하게 됩니다.

Tanstack Query는 caching, invalidate, refetch, prefetch등 다양한 인터페이스를 통해 개발자가 클라이언트에서 서버상태를 효과적으로 관리할 수 있게 도와줍니다. 덕분에 개발자에게 서버 상태 관리 라이브러리는 거의 선택이 아닌 필수가 되어가고 있는 듯 보입니다. (일단 저는 필수네요. 😁)

앞으로의 글은 Tanstack Query를 사용하면서, 불편했던 쿼리키를 구조화하고, 이를 쉽게 구조화 해주는 함수를 통해 코드베이스에서 효과적으로 QueryKey를 관리한 방법들을 설명하고자합니다.

## Tanstack Query의 Query Key

그렇다면 QueryKey를 왜 구조화 해야할까요? QueryKey의 중요성에 대해서 간단하게 알아보겠습니다.

Tanstack Query에서 queryKey는 다음과 같은 역할을 합니다.

- tanstack-query에서 내부적으로 data를 queryKey와 함께 mapping해 cache를 관리합니다.
- 이후 query에 대한 `dependency`가 변경될 때 자동으로 `refetch` 합니다.
- 개발자가 특정 mutation을 실행하고, 필요시 queryClient를 통해 해당 queryKey를 invalidate 시키거나, cache를 조작합니다.

요약하자면 **Query Key는 서버 상태와의 연결고리**로, 이를 통해 개발자는 서버 상태를 효율적으로 조회하거나 조작할 수 있습니다.

이러한 Query Key를 잘못 설계하거나 관리하지 않고 사용하면,개발자는 혼란과 오류를 초래할 수 있습니다.

### DX가 떨어지는 QueryKey 사용

아래의 예시를 통해 설명해 보겠습니다:

```tsx
const QUERY_KEYS = {
	LIST : ['LIST'],
	DETAIL : ['DETAIL']
}

// 세분화가 필요없는 쿼리의 경우 이렇게 가능합니다
const { data } = useQuery({
	queryKey: QUERY_KEYS.LIST,
	queryFn: () => fetchList()
})

const mutate = useMutation({
	...
	onSuccess: () => {
		queryClient.invalidateQuries({ queryKey : QUERY_KEYS.LIST })
	}
})

// 세분화가 필요한 쿼리의 경우엔 불편함이 다가옵니다
const { data } = useQuery({
	queryKey: [...QUERY_KEYS.DETAIL, id],
	queryFn: () => fetchDetailByID(id)
})

// 엄청 머나먼 코드의 위치!

const mutate = useMutation({
	...
	onSuccess: () => {
		// 외부에서 사용할때 queryKey의 구조를 개발자가 기억해야합니다.
		// 앗! 실수
		queryClient.invalidateQuries({ queryKey : [id, ...QUERY_KEYS.DETAIL] })
	}
})
```

이런 경우 왜 문제가 될까요?

Query Key는 배열 형태로 비교되므로, 요소의 순서가 달라지면 완전히 다른 키로 인식됩니다. 예를 들어, `[..., QUERY_KEYS.DETAIL, id]`와 `[id, ...QUERY_KEYS.DETAIL]`는 서로 다른 Query Key로 처리됩니다.

위와 같이 개발자는 언제나 실수하기 마련입니다. 이러한 실수로 인해 의도치 않은 에러를 만들 가능성이 있습니다. 만약 Query Key가 일관성 없이 관리된다면, 잘못된 캐시 관리로 인해 다음과 같은 문제가 발생할 수 있습니다:

- 기존 캐시 데이터가 잘못된 데이터로 덮어써짐
- 필요하지 않은 캐시 데이터가 삭제되거나, 의도치 않은 캐시가 무효화됨

이로 인해 서버 상태관리가 불안정해질 수 있습니다.

이를 방지하기 위해, Query Key를 구조화하는 것이 중요합니다. Query Key를 구조화하면 다음과 같은 이점을 얻을 수 있습니다:

- **일관성 유지**: Query Key의 순서를 명확히 정의함으로써 키의 혼동을 방지할 수 있습니다.
- **가독성 향상**: 구조화된 Query Key는 어떤 데이터를 가리키는지 명확히 파악할 수 있어 유지보수에 용이합니다.
- **오류 예방**: 잘못된 키 정의로 인한 캐싱 오류를 줄일 수 있습니다.

## QueryKey가 구조화가 가능한 이유

먼저 queryKey를 구조화하기 전에 구조화가 어떻게 가능한지 살펴보겠습니다.

Tanstack Query는 Query Key를 배열이나 객체로 구조화하고도 매끄럽게 일치하는 Query Key를 찾아낼 수 있습니다. 이게 가능한 이유는 **Query Cache**와 **Fuzzy Matching** 때문입니다.

### **Deterministic**

내부적으로 **Query Cache**는 직렬화된 Query Key인 key와 메타데이터를 더한 Query Data인 value로 이루어진 Javascript 객체입니다. Query Key들은 **deterministic** 한 방법으로 해시 처리되기에 key에 객체를 사용할 수 있습니다.

> [!NOTE] [deterministic한 방법?](https://tanstack.com/query/v4/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically)
>
> deterministic한 방법이란 객체가 들어왔을때 객체 프로퍼티의 순서에 상관없이 프로퍼티들이 동일하다면 같은 QueryKey로 보는 방법을 말합니다.

```tsx
export function hashQueryKeyByOptions<TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  options?: Pick<QueryOptions<any, any, any, any>, 'queryKeyHashFn'>
): string {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}

/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 */
export function hashKey(queryKey: QueryKey | MutationKey): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val
  );
}
```

### **Fuzzy Matching 퍼지 매칭(Fuzzy Matching)**

Tanstack Query는 일치하는 Query Key를 찾을 때 `fuzzy`하게 찾습니다. 여기서 `fuzzy`는 직역하면 **유사**나 **흐릿**으로 나오는데 예시로 설명하겠습니다.

예를 들어, `[‘A’, ‘B’, ‘C’]`와 같은 Query Key가 있다고 할 때 `queryClient.invalidateQuerires` 메서드에 Query Key 인수를 `[‘A’]`만 전달하여도 React Query가 찾아내는 Query Key 목록 안에 `[‘A’, ‘B’, ‘C’]`가 포함됩니다.

```tsx
export function partialDeepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
  }
}
```

이 두가지 로직 덕분에 개발자는 효과적으로 Query Key를 구조화할 수 있습니다.

## 다양한 쿼리키 구조화 방법

Query Key를 체계적으로 관리하기 위한 다양한 방법들이 존재합니다. 이 중 Tanstack Query의 공식 문서와 메인테이너 블로그에서 권장하는 방법을 중심으로 살펴보겠습니다.

### 상수를 활용한 queryKeyFactiories

Tanstack Query의 메인테이너인 TkDodo는 [자신의 블로그에서](https://tkdodo.eu/blog/effective-react-query-keys) 쿼리키 구조화의 중요성에 대해서 언급합니다.

특히, [**Use Query Key Factories**](https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories) 섹션에서, Query Key를 수동으로 선언하지 않고 **도메인별로 그룹화하여 Factory 패턴**으로 관리할 것을 권장합니다.

```tsx
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const
};
```

이렇게 사용하면 개발자는 각 도메인에 해당하는 Query Key를 선언적이고 일관되게 관리할 수 있습니다.

```tsx
// 🕺 remove everything related
// to the todos feature
queryClient.removeQueries({
  queryKey: todoKeys.all
});

// 🚀 invalidate all the lists
queryClient.invalidateQueries({
  queryKey: todoKeys.lists()
});

// 🙌 prefetch a single todo
queryClient.prefetchQueries({
  queryKey: todoKeys.detail(id),
  queryFn: () => fetchTodo(id)
});
```

### QueryKeyFactory 라이브러리 사용하기

Query Key Factory를 직접 구현하는 대신, 이미 만들어진 라이브러리를 활용할 수도 있습니다.

> [lukemorales - Query Key Factory](https://tanstack.com/query/v4/docs/framework/react/community/lukemorales-query-key-factory#fine-grained-declaration-by-features)

```tsx
import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  users: null,
  todos: {
    detail: (todoId: string) => [todoId],
    list: (filters: TodoFilters) => ({
      queryKey: [{ filters }],
      queryFn: (ctx) => api.getTodos({ filters, page: ctx.pageParam }),
    }),
  },
```

다음과 같은 방식으로 Query Key를 구조화 해 사용할 수 있습니다.

## Query Key 구조화

그렇다면 이제는 제가 쿼리키를 구조화한 방식을 소개하겠습니다.

제가 만드는 프로젝트에서(또한 작성자가 생각하기에 대부분의 웹 서비스)는 복잡한 요청을 포함해 다양한 도메인에서 CRUD로직을 작성하게 됩니다. 기본적으로 서비스는 HTTP의 REST API를 통해 이를 구조화하기 때문에 이를 활용해 Query Key를 구조화 하고자 했습니다.

간단한 포스팅 사이트를 생각해 봅시다. 포스팅 사이트에서는 대부분 다음과 같은 엔드포인트를 가지게 됩니다.

| API명                   | Portion of URL         |
| ----------------------- | ---------------------- |
| 포스트 전체 리스트 조회 | `/posts`               |
| 포스트 단일 조회        | `/posts/:id`           |
| 포스트 필터링           | `/posts?keyword=hello` |

이런 명세를 통해서 Query Key에서 사용해야하는 것들을 추려 구조화 하면 다음과 같습니다.

| API명                   | scope   | type     | data                    |
| ----------------------- | ------- | -------- | ----------------------- |
| 포스트 전체 리스트 조회 | `posts` | `list`   |                         |
| 포스트 단일 조회        | `posts` | `detail` | { id : `:id` }          |
| 포스트 필터링           | `posts` | `filter` | { keyword : `“hello”` } |

API 명세를 기반으로 Query Key에 사용할 요소들을 추출하였으므로 이를 조합하여 API별로 고유한 Query Key 객체를 만들어 낼 수 있습니다.

| API명                   | Query Key                                          |
| ----------------------- | -------------------------------------------------- |
| 포스트 전체 리스트 조회 | `[{ scope: 'posts', type : "list" }]`              |
| 포스트 단일 조회        | `[{ scope: 'posts', type : "detail", id : 1 }]`    |
| 포스트 필터링           | `[{ scope: 'posts', type : "filter", tags : [] }]` |

이제 구조화된 Query Key를 가지게 되었습니다. 이를 통해 다음과 같은 기대값을 가질 수 있습니다.

- `queryClinet.invalidateQueries([{ scope: ‘posts’ }])`를 통해 Posts도메인의 모든 쿼리를 무효화 할 수 있습니다.
- `queryClient.removeQueries([{ id: 1 }])`을 실행하여 `id`가 1인 특정 포스트와 관련된 캐시 데이터를 전부 삭제하는 작업도 가능합니다.

### createQueryOptions

Query Key를 구조화하는 작업은 일관성을 유지하고 오류를 줄이는 데 유용하지만, 개발자가 매번 수동으로 작성하는 것은 번거롭고, 실수를 유발할 가능성이 높습니다. 특히 Query Key가 복잡할수록, 이를 작성하면서 발생하는 **휴먼 에러**의 가능성도 커집니다.

따라서 앞서 메인테이너가 언급한 것 처럼 Query Key를 구조화 **시켜줄** 구현체가 필요해졌습니다.

어떻게 할 수 있을까요?

앞선 **Query Key 구조화** 파트 도입부에서 우리는 REST API의 엔드포인트를 통해 쿼리키를 구조화해 냈습니다. 이를 활용하면 어떨까요?

심지어 우리는 REST API fatch를 위한 함수를 만들면서, 필요한 정보들을 파라미터를 통해 효과적으로 선언하고 있습니다. 아래와 같은 방식을 통해서 말이죠.

```tsx
const PostApi = {
  list: (): Promise<Post[]> => fetch('/api/list').then((res) => res.json()),
  get: (id: number): Promise<Post> => fetch(`/api/get/${id}`).then((res) => res.json()),
  search: ({ keyword }: { keyword: string }): Promise<Post> =>
    fetch(`/api/search?keyword=${keyword}`).then((res) => res.json())
};
```

위의 `PostApi` 함수는 우리가 이전에 Query Key를 구조화 하기위해 사용했던 모든 정보를 포함하고 있습니다.

- `scope` : `post` 도메인 스코프로 감싸져있기 때문에 `post` 가 scope가 될 것입니다.
- `type` : 각각에 타입에 맞게 우리는 PostApi의 `key`를 선언하고 있습니다. 그 타입에 대한 동작으로 데이터 패칭 함수를 값으로 가지고 있습니다.
- `data` : 각각의 타입에 해당하는 데이터 패칭 함수는 데이터를 불러오기 위해 적당한 `파라미터`를 가지고 있습니다. 이 `파라미터`는 Query Key에서 사용할 정보로 충분합니다.

이제 QueryOptions Factory함수를 설계해 API 계층 코드를 활용해보겠습니다.

```tsx
// 인터페이스 선언
interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  draft: boolean;
  createdAt: Date;
}

// API 계층 코드
const PostAPI = {
  list: ():  Promise<Post[]> => fetch("/api/list").then((res) => res.json()),
  get: ({ id } : { id: number }): Promise<Post> => fetch(`/api/get/${id}`).then((res) => res.json()),
  search: ({ keyword }: { keyword: string }) :as Promise<Post[]> =>
    fetch(`/api/search?keyword=${keyword}`).then((res) => res.json()),
};

// Query Options 생성
const PostQueryOptions = createQueryOptions("post", PostAPI);

// 사용
PostQueryOptions.all().queryKey; // [{"scope": "post"}]
PostQueryOptions.type("list").queryKey; // [{"scope": "post", "type": "list"}]
PostQueryOptions.list().queryKey; // [{"scope": "post", "type": "list" }]
PostQueryOptions.get({id : 1}).queryKey; // [{"scope": "post", "type": "get", "id": 1}]
PostQueryOptions.search({ keyword: "react" }).queryKey; // [{ "scope": "post", "type": "search","keyword": "react"}]
```

이제는 더이상 Query를 추상화하기 위한 계층이 필요없습니다. API계층이 존재한다면, createQueryOptions를 통해 Query 계층을 간단하게 생성할 수 있습니다.

## QueryKey Factory를 통한 효과

앞서 구현한 factory 덕분에 코드베이스는 효과적으로 Tanstack Query와 관련된 코드를 개선할 수 있었습니다.

### **간결한 네이밍과 선언적 코드 작성**

기존에는 쿼리 설정을 추상화하는 과정에서 긴 네이밍이 필요했고, 각 쿼리마다 별도의 커스텀 훅을 작성해야 했습니다. Query Key Factory를 도입한 후, 선언적으로 옵션을 넘겨 간결하고 직관적인 코드를 작성할 수 있게 되었습니다.

```tsx
export function SuspenseUserLotusPagination({ page = 1 }: { page?: number }) {
  // 바뀌기 전에 매우 길고 끔찍한 Query Hook 네이밍
  // 필요한 쿼리마다 재작성 필요
  const { data: lotusList } = useUserLotusListSuspenseQuery({ page });
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}
```

기존에는 쿼리에 대한 여러 설정을 추상화하기 위해 긴 네이밍을 이용했습니다.

```tsx
export function SuspenseUserLotusPagination({ page = 1 }: { page?: number }) {
  // 직관적인 네이밍과 효과적인 재사용
  const { data: lotusList } = useSuspenseQuery(userQueryOptions.lotusList({ page }));
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}

// 유저의 Lotus 리스트 쿼리 무효화
queryClient.invalidateQueries(userQueryOptions.type('lotusList'));
```

이제는 기본적인 query훅을 커스텀하지 않고 팩토리로 만들어진 option을 넘겨 사용합니다.

또한 query훅 뿐만이 아닌 QueryOptions을 인터페이스로 사용하는 모든 요소에서 사용할 수 있습니다. 개발자는 하나의 options으로 직관적인 코드를 작성할 수 있게 되고, 휴먼에러를 방지할 수 있습니다.

### 다양한 쿼리훅에서 재사용

저희는 Tanstack Query를 보다 선언적으로 사용하기 위해서 React의 ErrorBoundary와 Suspense를 이용해 부수상태(pending, error)를 컴포넌트 외부에서 선언적으로 다루고 있습니다.

하지만 모든 코드를 선언적인 방식으로 작성할 수 있는 것은 아닙니다. 때로는 절차적인 코드가 더 직관적이거나 부수상태를 컴포넌트 내부에서 사용해야하는 경우가 있습니다.

기존에는 이를 위해서 useQuery와 useSuspenseQuery를 위한 각각의 쿼리훅을 커스텀했습니다.

```tsx
export const useUserQuery = () => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
    retry: 1
  });

  return query;
};

export const useUserSuspenseQuery = () => {
  const query = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: getUserInfo
  });

  return query;
};
```

둘은 같은 의도를 가진 코드이지만, 사용하는 방식이 다르다는 이유로 동시에 다른 곳에서 관리되고 있었습니다.

이제는 factory를 통해 하나의 option을 가지게 되므로 사용처에서 선언해 사용하면 됩니다.

```tsx

const query = useQuery({
  ...userQueryOptions.get({ id : 1 })
  retry: 1
});

const query = useSuspenseQuery(userQueryOptions.get({ id : 1 }));

```

### 의존성 주입

컴포넌트를 설계하다보면, UI는 동일하지만 다른 방식으로 같은 인터페이스의 데이터를 가져와야하는 경우가 존재합니다.

저희 서비스에서도 사용자의 Lotus 목록을 보여주거나, Public Lotus 목록을 보여주는 등 다양한 시나리오에서 Lotus 목록을 불러와야 했습니다. 기존에는 이를 해결하기 위해 각각의 데이터 로직에 대응하는 별도의 컴포넌트를 작성해야 했습니다.

```tsx
export function SuspenseLotusPagination({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useLotusListSuspenseQuery({ page });

  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/lotus', search: { page } })}
    />
  );
}

export function SuspenseUserLotusPagination({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useUserLotusListSuspenseQuery({ page });

  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}
```

이제는 **Query Options** 객체를 컴포넌트에 주입함으로써 중복을 제거하고, 컴포넌트를 재사용할 수 있습니다. Query Options 주입 방식을 통해 데이터 소스만 변경하여 동일한 UI를 활용할 수 있습니다.

```tsx
export function SuspenseLotusPagination({queryOptions} : {queryOptions : LotusListQueryOptions) {
  const { data: lotusList } = useSuspenseQuery(queryOptions);
  const navigate = useNavigate();

  return (
    <Pagination
      totalPages={lotusList?.page?.max ?? 1}
      initialPage={page}
      onChangePage={(page) => navigate({ to: '/user', search: { page } })}
    />
  );
}

// 사용자의 LotusList Pagenation
<SuspenseLotusPagination queryOptions={userQueryOptions.lotusList({ page: 1 })} />;

// 전체 LotusList Pagenation
<SuspenseLotusPagination queryOptions={lotusQueryOptions.list({ page: 1 })} />;
```

## 마치며

지금까지 프로젝트를 개발하면서, Query Key의 구조화를 통해 코드의 일관성을 유지하고, 유지보수성을 높이며, 휴먼 에러를 줄이는 방법들을 소개했습니다.

Query Key를 구조화하는 것은 단순히 **잘 정리된 코드**를 넘어, **효율적이고 안정적인 서버 상태 관리**를 가능하게 합니다. Query Key를 체계적으로 설계하고 관리하면 코드베이스의 유지보수성과 개발 생산성을 동시에 높일 수 있습니다.

## 참고자료

[Effective React Query Keys | TkDodo's blog](https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories)

[Query Keys | TanStack Query React Docs](https://tanstack.com/query/v4/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically)

[Query Key Factory | TanStack Query React Docs](https://tanstack.com/query/v4/docs/framework/react/community/lukemorales-query-key-factory#fine-grained-declaration-by-features)

[\[타임세이버\] query-key 줍다 지친 사람 여기 여기 붙어라 (with. query-key-factory) — 딩가링가쓰는 개발 일기](https://codingaring.tistory.com/entry/%ED%83%80%EC%9E%84%EC%84%B8%EC%9D%B4%EB%B2%84-query-key-%EC%A4%8D%EB%8B%A4-%EC%A7%80%EC%B9%9C-%EC%82%AC%EB%9E%8C-%EC%97%AC%EA%B8%B0-%EC%97%AC%EA%B8%B0-%EB%B6%99%EC%96%B4%EB%9D%BC-with-query-key-factory)

[React Query의 Query Key 구조화하기. 나는 어느 시점부터 라이브러리를 사용할 때 해당 라이브러리의… | by Taeyoung Jang | Medium](https://youngslog.medium.com/react-query%EC%9D%98-query-key-%EA%B5%AC%EC%A1%B0%ED%99%94%ED%95%98%EA%B8%B0-b8ddc6ec0f8e)

[Effective React Query With Key | dev-bbak](https://www.dev-bbak.site/blog/DEV/effective_querykey)
