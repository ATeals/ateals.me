---
title: 나의 Raycast 사용 방법
description: Mac을 효율적으로 다루어 보자.
image: https://i.imgur.com/NhuTBJX.png
date: 2024-09-08T22:40
tags:
  - tool
type: Snapshot
slug: using-raycast
---

저는 Mac으로 작업하면서 Spotlight를 정말 많이 애용했습니다. Spotlight의 검색창을 통해 맥에서 접근할 수 있는 모든 것들을 직접 찾지 않고 바로 접근할 수 있습니다.

![저는 배경이나 Dock이 깔끔한 것을 선호하므로 저에게 너무 좋은 기능입니다.](https://i.imgur.com/A12Ha1P.png)

하지만 Spotlight도 한계가 있습니다. 가령 크롬으로 네이버에 클로바 노트를 검색한다든지, vscode에서 내가 가장 최근에 작업했던 폴더를 열고 싶다든지, 이런 연속적인 동작을 하기 위해서는 각각 앱을 열어서 직접 해줘야 했습니다.

하지만 오늘 소개해 드릴 Raycast를 사용하면 이러한 것들을 모두 자동화할 수 있습니다. 덕분에 사용자는 연속적인 동작을 Raycast 내부에서 작업할 수 있는 것이죠!

> 자세한 내용은 [공식 페이지](https://www.raycast.com/)를 참고해 주세요.

지금부터는 제가 주로 사용하는 것들을 소개하고자 합니다.

## 단축키

자주 사용하는 앱들은 단축키를 통해서 바로 실행할 수 있습니다. 혹은 별칭을 지정해 raycast에 검색할 때 별칭으로 검색할 수 있습니다.

## Window Management

맥에서 화면 제어를 위해서는 Rectangle과 같은 추가 앱이 필요합니다.

Raycast에서는 이를 지원해 단축키로 지정해서 사용할 수 있습니다.

![](https://i.imgur.com/l9b6luF.png)

## Quicklink

GPT를 열기 위해서, 클로드를 열기 위해서, 유튜브를 열기 위해서 크롬을 검색해서 직접 크롬을 켜서 검색창에 한 번 더 검색했던 경험이 있으실 겁니다.

Raycast 기본 기능인 Quicklink를 사용하면 이를 해결할 수 있습니다.

![](https://i.imgur.com/N7mi3n9.png)
이렇게 이름과 링크를 만들어주면 북마크처럼 활용할 수 있습니다.

![](https://i.imgur.com/hnjQGxJ.png)
또한 검색 변수를 넣어줄 수 있기 때문에 포탈서비스에 직접 들어가지 않고 바로 검색할 수 있습니다.

![직접 선택한 alias로 검색을 할 수 있습니다.](https://i.imgur.com/opzVJ4M.png)

## history

맥북에서는 클립보드를 따로 찾아볼 수 있는 기능이 없습니다.

history를 사용하면 클립보드에 복사했던 히스토리를 표시해 줍니다.

![](https://i.imgur.com/6M8AhDM.png)

## Script

쉘 스크립트를 만들어 등록해 사용할 수 있습니다.

저 같은 경우 프론트엔드 테스트를 위해서 가끔 시크릿 창을 열 때가 있는데 이를 등록해 손쉽게 크롬 시크릿 탭을 열 수 있습니다.

![](https://i.imgur.com/5hapg8m.png)

## Extensions

Raycast는 충분한 기본 기능 이외에 [Community Store](https://www.raycast.com/store)를 지원합니다. 이를 통해 추가적인 기능을 사용할 수 있습니다. 또한 Raycast는 Javascript로 이루어져 있기 때문에 Javascript를 이용해 자신만에 Extension을 만들어 사용할 수 있습니다.

### Search GIF

저는 가끔 GIF 짤을 블로그 포스팅이나 발표 자료에 사용합니다. 이러한 GIF 검색을 Raycast 내부에서 할 수 있습니다.

![](https://i.imgur.com/6LjDXA9.png)

### Color Picker

맥북에서 색상과 관련된 모든 작업을 할 수 있습니다. 색을 추출하거나, 고르거나, 팔레트를 저장하는 행동을 할 수 있습니다.

![](https://i.imgur.com/NzWYSSS.png)

### Shell Script

터미널을 통하지 않고 Raycast에서 바로 터미널 명령을 실행할 수 있습니다.

저는 `/`를 통해 명령을 지정해 놓고 명령이 필요한 상황에 사용하고 있습니다.

![](https://i.imgur.com/M9joOpC.png)

### 타사 제품

자주 사용하는 Notion, Vscode, Slack, GitHub, Chrome, Arc, Jira, Figma .... 에 대한 여러 가지 플러그인들이 있습니다.

이를 통해 타사 제품에 직접 들어가지 않고 Raycast에서 손쉽게 동작시킬 수 있습니다.

![vscode에서 최근 폴더 열기, 새창열기, 익스텐션 설치하기](https://i.imgur.com/LnfTp9w.png)
![아크 브라우저에서 여러가지 동작하기](https://i.imgur.com/m3uHNGl.png)
![노션에서 검색하기, 데이터베이스 만들기, 캘린더 열기](https://i.imgur.com/tYE1YX0.png)
![옵시디언에서 여러가지 작업하기](https://i.imgur.com/iM7iuIM.png)

## etc

지금까지 설명드린 것들 이외에도 애플에서 사용하는 기본 앱 (미리 알림, 캘린더, 메일)들을 연결에서 Raycast 내부에서 처리할 수 있습니다.

또한 Store 덕분에 사용자가 할 수 있는 일은 무궁무진합니다.

## 마치며

지금까지 Raycast에서 제가 주로 사용하는 기능들을 설명드렸습니다. 한마디로 Raycast를 설명하자면, 워크플로우를 한 번에 실행시켜주는 어플이라고 할 수 있을 것 같습니다.

더욱 놀라운 점은 지금까지 설명드린 모든 기능이 `무료`라는 점입니다.

앞으로 더욱 많은 분들이 Raycast를 사용해 Raycast 생태계가 더욱 탄탄해졌으면 좋겠습니다.

_Raycast 없이는 살수 없습니다.. 만능 Raycast 만세_

## 관련 포스트

[생산성에 진심인 자의 Raycast 세팅 엿보기 (for macOS)](https://velog.io/@wisepine/%EC%83%9D%EC%82%B0%EC%84%B1%EC%97%90-%EC%A7%84%EC%8B%AC%EC%9D%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%9D%98-Raycast-%EC%84%B8%ED%8C%85-%EC%97%BF%EB%B3%B4%EA%B8%B0-for-macOS)

[업무의 효율을 높여주는 'Raycast'](https://brunch.co.kr/@ggk234/32)
