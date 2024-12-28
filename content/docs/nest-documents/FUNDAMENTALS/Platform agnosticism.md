---
title: Platform agnosticism
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-08-14T13:38
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: platform-agnosticism
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/fundamentals/platform-agnosticism)

Nest는 플랫폼에 구애받지 않는 프레임워크입니다. 즉, 다양한 유형의 애플리케이션에서 사용할 수 있는 **재사용 가능한 논리적 부분**을 개발할 수 있습니다. 예를 들어, 대부분의 구성 요소는 서로 다른 기본 HTTP 서버 프레임워크(예: Express 및 Fastify)와 서로 다른 유형의 애플리케이션(예: HTTP 서버 프레임워크, 전송 계층이 다른 마이크로서비스, 웹 소켓)에서도 변경 없이 재사용할 수 있습니다.

## Build once, use everywhere[#](https://docs.nestjs.com/fundamentals/platform-agnosticism#build-once-use-everywhere)

이 문서의 **Overview** 섹션에서는 주로 HTTP 서버 프레임워크를 사용하는 코딩 기법(예: REST API를 제공하는 앱 또는 MVC 스타일의 서버 측 렌더링 앱 제공)을 보여줍니다. 그러나 이러한 모든 빌딩 블록은 다양한 전송 계층([microservices](https://docs.nestjs.com/microservices/basics) 또는 [websockets](https://docs.nestjs.com/websockets/gateways)) 위에서 사용할 수 있습니다.

또한 Nest에는 전용  [GraphQL](https://docs.nestjs.com/graphql/quick-start) 모듈이 함께 제공됩니다. GraphQL을 REST API를 제공하는 것과 동일하게 API 계층으로 사용할 수 있습니다.

또한 [application context](https://docs.nestjs.com/application-context) 기능을 사용하면 Nest를 기반으로 CRON 작업 및 CLI 앱과 같은 모든 종류의 Node.js 애플리케이션을 만들 수 있습니다.

Nest는 애플리케이션에 더 높은 수준의 모듈성과 재사용성을 제공하는 Node.js 앱을 위한 본격적인 플랫폼이 되고자 합니다. 한 번 빌드하면 어디서나 사용 가능!
