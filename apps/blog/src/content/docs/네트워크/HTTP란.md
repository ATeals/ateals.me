---
title: HTTP란
description: HyperText Transfer Protocol
image: https://i.imgur.com/x48oIl1.png
date: 2024-08-12T14:51
draft: false
tags:
  - 네트워크
slug: http
series : network
---

HTTP (HyperText Transfer Protocol, 하이퍼텍스트 전송 프로토콜)는 웹에서 정보를 주고받기 위한 프로토콜이다. 주로 HTML 문서를 주고받는 데 사용된다. HTTP는 일반적으로 TCP를 사용하지만, HTTP/3부터는 UDP를 사용한다. HTTP는 80번 포트를 이용한다. HTTP 1.0은 1996년에 발표되었고, HTTP 1.1은 1999년에 발표되었다.

HTTP는 클라이언트와 서버 간의 요청/응답 프로토콜이다. 예를 들어, 클라이언트인 웹 브라우저가 HTTP를 통해 서버로부터 웹페이지나 이미지 정보를 요청하면, 서버는 이 요청에 응답하여 필요한 정보를 사용자에게 전달한다. 이 정보는 모니터와 같은 출력 장치를 통해 사용자에게 나타나게 된다.

HTTP는 Stateless 하다

## HTTP 메시지

![](https://i.imgur.com/TofjmnX.png)

- HTTP 메시지는 서버와 클라이언트 간에 데이터가 교환되는 방식을 말한다. ASCII로 인코딩된 텍스트 정보이며 여러 줄로 구성되어 있다.
- 요청과 응답 두 가지 타입이 존재하며, 각각 특정한 포맷을 가진다.
- 확장성이좋다.

![](https://i.imgur.com/KY6mcfl.png)

두 타입은 다음과 같은 공통 속성이 있다.

- HTTP 요청/응답에 대한 성공, 실패가 기록된다. 항상 한줄이다.
- 헤더 : 시작 줄 다음으로 요청에 대한 설명이나 메시지 본문에 대한 설명이 들어간다.
- 빈줄 : 요청 헤더와 본문을 구분한다.
- 본문 : 요청과 관련된 데이터 또는 응답과 관련된 문서가 선택적으로 들어간다. 본문의 존재와 크기는 시작 줄 및 HTTP 헤더에 명시된다.

### REQUEST

![](https://i.imgur.com/ov1iso1.png)

- 시작 줄 : 3가지 요소로 구성되어 있다. `HTTP_METHOD` + `URI` + `HTTP_VERSION`
  - `HTTP_METHOD` : 서버가 수행해야할 동작을 나타낸다.
    - **GET :** GET 메서드는 특정 리소스의 표시를 요청하는 데 사용된다. GET을 사용하는 요청은 오직 데이터를 받기만 한다.
    - **POST :** POST 메서드는 특정 리소스에 데이터를 제출할 때 사용된다. 이는 종종 서버의 상태를 변화시키거나 부작용을 일으킬 수 있다.
    - **PUT :** PUT 메서드는 목적 리소스의 모든 현재 상태를 요청한 데이터로 변경한다.
    - **PATCH** : PATCH 메서드는 리소스의 일부만을 수정하는 데 사용된다.
    - **DELETE :** DELETE 메서드는 특정 리소스를 삭제하는 데 사용된다.
    - **HEAD:** HEAD 메서드는 GET 메서드와 동일한 요청을 하지만, 응답 본문을 포함하지 않는다.
    - **CONNECT :** CONNECT 메서드는 목적 리소스로 식별되는 서버와의 터널을 설정하는 데 사용된다.
    - **OPTIONS :** OPTIONS 메서드는 목적 리소스와의 통신을 설정하는 데 쓰인다.
    - **TRACE :** TRACE 메서드는 목적 리소스의 경로를 따라 메시지의 루프백 테스트를 수행한다.
      > [](<https://yozm.wishket.com/magazine/detail/694/#:~:text=HTTP%EC%9D%98%20%EC%84%9C%EC%B9%98(SEARCH)%EB%8A%94,HTTP%EC%9D%98%20%EC%83%88%EB%A1%9C%EC%9A%B4%20%EB%A9%94%EC%84%9C%EB%93%9C%EC%9E%85%EB%8B%88%EB%8B%A4>)[https://yozm.wishket.com/magazine/detail/694/#:~:text=HTTP의](https://yozm.wishket.com/magazine/detail/694/#:~:text=HTTP%EC%9D%98) 서치(SEARCH)는,HTTP의 새로운 메서드입니다.
  - `URI` : URL, 프로토콜, 포트, 도메인의 경로가 온다.
    - origin : `?` 와 같은 쿼리 문자열이 붙는 절대 경로, 가장 일반적인 형식이다.
      ```jsx
      POST / HTTP 1.1
      GET / background.png HTTP/1.0
      HEAD /test.html?query=alibaba HTTP/1.1
      OPTIONS /anypage.html HTTP/1.0
      ```
    - absolute : 완전한 URL
      ```jsx
      GET <http://developer.mozilla.org/en-US/docs/Web/HTTP/Messages> HTTP/1.1
      ```
    - authority : 도메인 이름 및 옵션 포트(`:` )로 이루어져 있다.
      ```jsx
      CONNECT developer.mozilla.org:80 HTTP/1.1
      ```
    - asterisk : 옵션과 함께 와일드카드 (`*` )로 간단하게 서버 전체를 나타낸다.
      ```jsx
      (OPTIONS * HTTP) / 1.1;
      ```
  - `HTTP_VERSION` : 사용할 HTTP 버전

### HEADER

- 헤더는 대소문자를 구분하지 않는 `이름, : , 값`으로 구성된다. 값 앞 공백은 무시한다.
- 헤더는 값까지 포함해 한줄로 구성되지만 길어질 수 있다.
- 헤더는 몇몇 그룹으로 나눌 수 있다.

![](https://i.imgur.com/kqCR2ka.png)

- REQUEST 헤더 : 요청의 내용을 구체화 하고, 컨텍스트를 제공
  - **Host**: 서버의 **도메인 이름**(포트는 Optional)
  - **User-Agent**: 사용자 에이전트(클라이언트)의 **브라우저, 운영 체제, 플랫폼** 및 버전
  - **Accept**: 클라이언트가 이해 가능한 (허용하는) **파일 형식** (MIME TYPE)
  - **Accept-Encoding**: 클라이언트가 해석할 수 있는 **인코딩**, 콘텐츠 압축 방식
  - **Authorization**: **인증 토큰**(JWT나 Bearer 토큰)을 서버로 보낼 때 사용하는 헤더, API 요청을 할 때 토큰이 없으면 거절을 당하기 때문에 이 때, Authorization을 사용
  - **Origin**: POST와 같은 요청을 보낼 때, 요청이 **어느 주소에서 시작되었는지**를 나타냄. 여기서 요청을 보낸 주소와 받는 주소가 다르면 [CORS 문제](https://www.zerocho.com/category/NodeJS/post/5a6c347382ee09001b91fb6a)가 발생하기도 함
  - **Referer**: 이 페이지 **이전의 페이지 주소**가 담겨 있음. 이 헤더를 사용하면 어떤 페이지에서 지금 페이지로 들어왔는지 알 수 있음
  - **IF-Modified-Since**: 최신 버전 페이지 요청을 위한 필드, 요청의 부하를 줄임. 서버는 지정된 날짜 이후에 마지막으로 수정된 경우에만 200 상태 코드로 요청된 리소스를 다시 보냄, 만약 이후에 리소스가 수정되지 않았다면 서버는 본문 없이 304 상태 코드로 응답을 보냄
- **General 헤더**: **메시지 전체에 적용**되는 헤더이다.
  - **Connection**: 현재의 전송이 완료된 후 네트워크 접속을 유지할지 말지를 제어함. `keep-alive`면, 연결은 지속되고, 동일한 서버에 대한 후속 요청을 수행할 수 있음. 일반적으로 `HTTP/1.1`을 사용하고 Connection은 기본적으로 `keep-alive`로 되어있음.
  - [**Via**](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Via): 요청헤더와 응답헤더에 포워드 프록시와 리버스 프록시에 의해서 추가됨. 포워드 메시지를 추적하거나, 요청 루프 방지, 요청과 응답 체인에 따라 송신자의 프로토콜 정보를 식별함
- **Entity 헤더**: **요청 본문에 적용**되는 헤더이다. 요청 내에 본문이 없는 경우에는 당연히 전송되지 않는다.
  - **Content-Length**: 요청과 응답 메시지의 **본문 크기**를 **바이트 단위**로 표시해줌. 메시지 크기에 따라 자동으로 만들어짐

### 본문

- 본문은 요청 마지막 부분에 들어가며, 옵셔널이다.
- 일부 요청은 메서드를 처리하기 위한 데이터를 서버에 전송해야한다. 이를 본문에 담아 전송한다.
  - **단일-리소스 본문**(single-resource bodies): 헤더 두 개([`Content-Type`](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Type)와 [`Content-Length`](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Content-Length))로 정의된 단일 파일로 구성된다.
  - **다중-리소스 본문**(multiple-resource bodies): `multipart` 본문으로 구성되며, 파트마다 다른 정보를 포함한다. 보통 [HTML Form](https://developer.mozilla.org/en-US/docs/Learn/Forms)과 관련이 있다.

### RESPONSE

- 응답은 요청에 대한 서버의 답변이다.

![](https://i.imgur.com/dKWuHGI.png)

- 상태 줄
  - HTTP 응답의 시작 줄은 **상태 줄(status line)**이라고 말한다.
  - 상태 줄은 세 가지 요소로 구성되어 있다.
    - `PROTOCOL_VERSION` + `STATUS_CODE` + `STATUSE_MESSAGEE`
    - `PROTOCOL_VERSION` : 해당 프로토콜의 버전이다.
    - `STATUS_CODE` : 요청의 성공 실패를 [숫자 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)로 나타낸다.
    - `STATUSE_MESSAGEE` : 짧고 간결하게 상태 코드에 대한 설명을 나타낸 글이다.

## 참고

[https://en.wikipedia.org/wiki/HTTP](https://en.wikipedia.org/wiki/HTTP)

[https://developer.mozilla.org/ko/docs/Web/HTTP/Methods](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods)

[https://velog.io/@bky373/Web-HTTP와-HTTPS-초간단-정리](https://velog.io/@bky373/Web-HTTP%EC%99%80-HTTPS-%EC%B4%88%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC)
