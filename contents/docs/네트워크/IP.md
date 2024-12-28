---
title: IP
description: 인터넷 프로토콜(IP)
image: https://i.imgur.com/x48oIl1.png
date: 2024-08-12T14:50
tags:
  - 네트워크
slug: ip
series: network
---

> [cloudflare 문서](https://www.cloudflare.com/ko-kr/learning/dns/glossary/what-is-my-ip-address/)를 옮긴 글입니다.

'IP' 는 [인터넷 프로토콜(Internet Protocol)](https://www.cloudflare.com/learning/network-layer/internet-protocol/)의 약자로, 장치들이 [인터넷](https://www.cloudflare.com/learning/network-layer/how-does-the-internet-work/)을 통해 통신할 수 있도록 하는 규칙의 집합을 말한다. 매일 수십억 명의 사람들이 인터넷에 접속하고 있으므로 누가 무엇을 하고 있는지를 추적하려면 고유의 식별자가 필요하다. 인터넷 프로토콜은 인터넷에 액세스하는 모든 장치에 IP 번호를 할당함으로써 이를 해결한다.

![](https://i.imgur.com/An0I4BD.png)

컴퓨터의 IP 주소는 집의 물리적 주소와 같다. 음식을 배달시키려면 물리적 주소를 알려줘야 한다. 이 주소가 없으면, 음식 배달원이 어디로 음식을 배달해야 할지 모르게 된다.

예를 들어, 사용자가 웹 브라우저에 [도메인 이름](https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/)(예: google.com)을 입력하면, Google의 웹 서버에 콘텐츠(Google 홈 페이지)를 보내달라는 요청이 시작된다. Google에서 요청을 수신하면 웹 사이트 콘텐츠를 어디로 전송할지 알아야 한다. 따라서 요청에는 요청자의 IP 주소가 포함된다. Google에서는 제공된 IP 주소를 사용하여 사용자의 장치에 응답을 전송할 수 있으며, 장치에서는 웹 브라우저에 해당 콘텐츠를 표시한다.

이를 모두 조정하는 시스템을 [DNS](https://www.cloudflare.com/learning/dns/what-is-dns/)라고 한다. 이는 IP의 전화번호부처럼 사람들은 이를 이용해 사람에게 친숙한 도메인 이름으로 웹 서비스를 이용할 수 있다. 사용자가 브라우저 창에 도메인 이름(예: facebook.com)을 입력하면, DNS 쿼리가 시작되어 마지막에는 [DNS 서버](https://www.cloudflare.com/learning/dns/dns-server-types/)가 도메인 이름을 IP 주소로 변환한다.

IP 주소는 IPv4와 IPv6 중 어떤 프로토콜을 사용하는지에 따라 형식이 다르다.

## IPv4와 IPv6

IPv4와 IPv6는 인터넷 프로토콜의 다른 버전입니다. IPv4는 1983년부터 실행되었으며 현재도 사용 중이다. IPv4 주소의 형식은 점으로 구분된 네 개의 숫자(예: '192.0.2.1')이다. 이는 32비트 형식이므로, 232개, 즉 약 43억 개의 고유 IP 주소가 있을 수 있지만, 현재 인터넷을 이용하는 장치의 수에 비해 부족합니다. 더 많은 IP 주소가 필요해져서 IPv6가 탄생하게 됐다. IPv6 주소는 보다 복잡한 형식을 사용하며, 숫자와 문자가 하나 또는 두 개의 콜론으로 구분된다(예: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'). 이 128비트 형식은 2128개(이 숫자는 39자리 숫자)의 고유 주소를 지원할 수 있다.

IPv6는 보안 및 [개인 정보 보호](https://www.cloudflare.com/learning/privacy/what-is-data-privacy/) 등의 측면에서도 IPv4를 개선했다. 둘 사이에 차이점이 있지만, IPv4와 IPv6 둘 다 10여 년 동안 웹에서 동시에 사용됐다. 두 버전은 동시에 실행할 수 있지만, IPv4와 IPv6 장치 간의 통신을 용이하게 하기 위해서는 특별한 조치를 구현해야 했다. 웹의 상당히 많은 부분이 여전히 IPv4 주소를 이용하고 있었으므로 이러한 절충안이 나올 수밖에 없었다.

## 정적 IP와 동적 IP

IPv4는 주소가 부족하기 때문에 IP 주소를 동적으로 지정하게 되었으며, 이는 아직도 널리 사용되는 방법이다. 인터넷에 연결된 대부분의 장치에는 임시 IP 주소가 할당된다.

예를 들어, 가정 내 사용자가 자신의 노트북으로 인터넷에 접속하면 사용자의 ISP가 공유 IP 주소 풀에서 임시 IP 주소를 할당한다. 이는 동적 IP 주소라고 한다. ISP로서는 이렇게 하는 것이 사용자마다 영구적 또는 정적 IP 주소를 할당하는 것보다 비용 효과적이다.

![](https://i.imgur.com/CrrQfJ7.png)

대기업과 같은 일부 ISP 고객은 정적 IP 주소(예: Cloudflare의 [1.1.1.1](https://www.cloudflare.com/learning/dns/what-is-1.1.1.1/))를 유지하기 위해 대가를 지불한다. 하지만 대부분의 사용자는 동적 IP 주소를 가지는 것으로 충분하다. 자체 호스팅 웹 사이트, [API](https://www.cloudflare.com/learning/security/api/what-is-an-api/), 게임 서버 등의 웹 서버를 호스팅하게 되면 동적 IP 주소의 경우 문제가 생길 수 있다. IP 주소를 변경하면 DNS 쿼리가 실패하므로 결과적으로 리소스가 다운될 수 있다. 다행히 이 문제는 Cloudflare의 [동적 DNS](https://www.cloudflare.com/learning/dns/glossary/dynamic-dns/)로 쉽게 개선할 수 있다.
