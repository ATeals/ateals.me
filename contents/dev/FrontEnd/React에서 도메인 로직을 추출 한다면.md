---
title: React에서 도메인 로직을 추출 한다면
description: 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기를 읽고 드는 생각
image:
date: 2024-01-22T14:47:00
tags:
  - 프론트
  - React
  - 연구소
slug: extracting-domain-logic-in-react
---

최근에 제가 프론트엔드 공부를 하면서 가장 고민하는 부분은 관심사 분리인 것 같습니다.

> The library for web and native user interfaces -React-

공식 문서에도 잘 설명되어 있듯 리액트는 인터페이스를 위한 라이브러리이기 때문에 도메인의 비즈니스 로직이나 렌더링을 위한 로직의 위치를 강제하지 않습니다. 따라서 프론트엔드 개발자는 관심사 분리에 대한 문제를 피할 수가 없는데요. 오늘은 이에 대해 공부한 내용을 기록해 보고자 합니다.

## 기존 관심사 분리

기존의 저는 잘 알려진 리액트의 패턴을 사용해 개발해 왔습니다. 제가 리액트로 개발을 하는 과정을 나열하면 다음과 같습니다.

- 필요한 기능을 위한 컴포넌트를 설계합니다.
- 단일 책임 원칙에 따라 컴포넌트에서 도메인에 관련된 로직을 분리하기 위해 커스텀 훅을 만들어 컴포넌트에서 호출합니다.
- 이로써 순수한 UI컴포넌트(Presentational Component), 도메인 로직을 위한 컴포넌트(Container Component)나 훅으로 이루어진 관리하기 용이한 리액트 애플리케이션을 만들 수 있습니다.

이로써 저는 충분히 분리된 코드를 작성했다고 판단했습니다.

[[번역] 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기](https://velog.io/@eunbinn/modularizing-react-apps#%EB%94%94%EC%9E%90%EC%9D%B8-%EC%A2%80-%EB%8D%94-%EB%B0%9C%EC%A0%84%EC%8B%9C%ED%82%A4%EA%B8%B0-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%B6%94%EC%B6%9C)

_엄청난 인사이트를 준 글입니다. 너무 좋은 글이라 한번 읽어보시는 것을 추천드립니다._

하지만 이 글을 읽고 나서 저는 제가 너무 좁은 시야로 개발을 하던 건 아닌가 생각하게 되었습니다. 제가 해본 프론트엔드 개발은 React에 종속되어 있었기 때문입니다.

글에서 현대의 리액트 애플리케이션의 유지 보수를 위한 단계를 다음과 같이 설명합니다.

1. 단일 컴포넌트 애플리케이션
2. 다중 컴포넌트 애플리케이션
3. 훅을 이용한 상태 관리
4. 비즈니스 모델의 등장
5. 계층화 된 애플리케이션

리액트를 공부하다 보면 보통 3번까지의 중요성은 누구나 인지하고 있다고 생각합니다. 함수 컴포넌트를 역할에 따라 분리하고 훅을 이용해 각 도메인마다 상태를 관리하는 것은 리액트의 전형적인 패턴이기 때문입니다.

다만 저는 4번부터는 생소했습니다. 지금까지 훅을 이용한 비즈니스 로직 응집화와 추출로 충분하다고 생각했기 때문입니다.

글을 통해 제가 이해한 내용을 바탕으로 만들어본 Todo 앱을 가지고 설명해보겠습니다.

## 리액트 앱에서 비즈니스 로직 추출하기

```tsx
class Todo {
  public isDone = false;
  constructor(
    public id: number,
    public text: string
  ) {}

  get completeLable() {
    return this.isDone && '달성 !';
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }
}

class TodoViewModel {
  constructor(public todos: Todo[] = []) {}

  createTodo(text: string) {
    return this.todos.push(new Todo(Date.now(), text));
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  get list() {
    return this.todos;
  }

  get isEmpty() {
    return this.list.length < 1;
  }
}
```

다음 코드는 Todo와 Todo를 제어하는 viewModel을 class로 구현했습니다. 이는 기본적인 데이터와 해당 데이터를 제어하는 기본적인 도메인 로직이 포함되어 있습니다.

```tsx
const useTodo = ({ todoViewModel }: { todoViewModel: TodoViewModel }) => {
  const [todos, setTodos] = useState<Todo[]>(todoViewModel.list);

  const update = () => setTodos([...todoViewModel.list]);

  const toggleDone = (todo: Todo) => {
    todo.toggleDone();
    update();
  };

  const createTodo = (text: string) => {
    todoViewModel.createTodo(text);
    update();
  };

  const deleteTodo = (id: number) => {
    todoViewModel.deleteTodo(id);
    update();
  };

  return { toggleDone, createTodo, todos, deleteTodo, isEmpty: todoViewModel.isEmpty };
};
```

이를 리액트의 상태와 동기화하기 위해 훅에 viewModel을 결합합니다. 이때 외부에서 viewModel을 주입합니다.

```tsx
const TodoComponent = ({ todoViewModel }: { todoViewModel: TodoViewModel }) => {
  const [input, setInput] = useState('');

  const { todos, createTodo, toggleDone, deleteTodo } = useTodo({ todoViewModel });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo(input);
    setInput('');
  };

  const handleClick = (todo: Todo) => {
    toggleDone(todo);
  };

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div>
      <h1>Todo</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button>할 일 추가</button>
      </form>
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <span onClick={() => handleClick(todo)} style={{ opacity: todo.isDone ? 0.7 : 1 }}>
              {todo.completeLable} {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const todoViewModel = new TodoViewModel();
  return (
    <div>
      <TodoComponent todoViewModel={todoViewModel} />
    </div>
  );
};
```

이를 필요한 컴포넌트에 적절히 사용해 줍니다.

이렇게 viewModel과 확장된 Model을 리액트 외부에서 구현했을 때의 장점과 단점은 무엇이 있을까요? 제가 생각한 장단점은 다음과 같습니다.

- 장점
  - 도메인 로직을 소유한 ViewModel과 Model이 리액트로부터 자유롭습니다. 즉 다른 UI라이브러리를 사용해도 도메인 로직을 다시 작성할 필요 없고, 심지어는 node를 사용하는 백엔드에서도 사용할 수 있습니다.
  - 도메인 로직이 한 곳에 응집되어 있기 때문에 수정과 관리에 용이합니다.
  - 해당하는 훅의 viewModel이 필요로 하는 인터페이스만 만족한다면, 어떤 ViewModel을 사용할지는 훅에서 고려하지 않습니다.
- 단점
  - react의 상태와 동기화하기 위해 별도의 노력이 필요합니다. 이는 ViewModel과 상태를 연결하면서 발생할 수 있는 별도의 SideEffeft를 관리해야 할 수 있습니다. *useTodo 훅에서도 todoViewMode과 상태를 연결하기 위해 메서드 외에 setter를 반복해서 호출하는 것을 확인할 수 있습니다.*
  - 추상화가 한 단계 더 생김에 따라 코드 구조의 복잡성이 증가합니다. 따라서 도메인 로직에 필요한 네이밍이나 추상화 단계와 같은 클린코드 요소가 중요해집니다. 또한 비즈니스 로직이 복잡해짐에 따라 구현 난이도가 훨씬 증가합니다.

장단점을 통해 미루어 보았을 때, 또한 원글에서 밝히 듯 이러한 분리는 엔터프라이즈 레벨 즉, 극도로 복잡한 도메인에 대해서만 유효할 수 있습니다. 대부분의 리액트 애플리케이션은 이미 훅을 이용한 분리로 충분할 수 있습니다.

이를 통해 제가 저만의 기준과 위에서 언급한 내용을 토대로 내린 결론은 다음과 같습니다.

- 대부분의 React 애플리케이션에서는 도메인 로직을 단일 책임 원칙을 통해 분리한 훅이나 컴포넌트로 충분히 관심사 분리에 대한 이점을 누릴 수 있다.
- 현대의 개발에서 다수의 프로젝트는 여러 가지 UI 라이브러리를 병합해 사용하지 않기 때문에 React를 사용하는 서비스에서 다른 UI 라이브러리 도입을 고려할 필요가 크지 않다.
- 원글과 같이 서버 데이터를 클라이언트로 옮기면서 UI 친화적인 데이터 상태로 변경하기 위한 확장된 모델은 꽤나 유용한 전략인 것 같다.

아직 제가 다루는 애플리케이션 레벨에서는 훅 이상의 분리를 시도하지는 않을 것 같습니다. 하지만 글의 내용을 통해 충분히 확장된 사고로 설계할 때의 이점을 알게 되었고, 서버 상태를 처리할 때 이러한 패턴이 매우 유용하다는 생각이 들게 되었습니다.

다음 글로는 이러한 전략을 가지고 스스로 구현해 본 프로젝트를 소개해 보면 좋을 것 같습니다.

## +

최근에 개발바닥 유튜브를 즐겨보다가 호돌맨님의 요절복통 개발쇼를 보게되었습니다.

[호돌맨의 양손기부, 배워보자 리액트](https://www.youtube.com/watch?v=l0ivBzy2rBg)

여기서 valtio를 사용해 Proxy 기반 상태 관리를 하는 모습을 알 수 있는데요.

어쩌면 이 방식이 리액트에 분리된 비즈니스 로직을 작성할 수 있는 좋은 예시가 아닌가 싶습니다.

객체 지향 프로그래밍에 익숙한 개발자가, 리액트를 다뤄야 하는 상황이 온다면 이 방식이 가장 편리하지 않을까 생각해봅니다.
