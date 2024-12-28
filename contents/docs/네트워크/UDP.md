---
title: UDP
description: UDP/IP
image: https://i.imgur.com/x48oIl1.png
date: 2024-08-12T14:48
draft: false
tags:
  - 네트워크
slug: udp
series: network
---

> [cloudflare](https://www.cloudflare.com/ko-kr/learning/ddos/glossary/user-datagram-protocol-udp/)문서를 옮긴 글입니다.

사용자 데이터그램 프로토콜(UDP)은 통신 프로토콜로, [특히 비디오 재생](https://www.cloudflare.com/learning/video/what-is-streaming/) 또는 [DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) 조회와 같이 시간에 민감한 전송을 위해 인터넷을 통해 사용된다. 이 프로토콜의 경우 데이터가 전송되기 전에는 공식적으로 연결이 설정되지 않으므로 통신 속도가 빨라진다. 따라서 데이터를 아주 빠르게 전송할 수 있지만, 전송 중에 [패킷](https://www.cloudflare.com/learning/network-layer/what-is-a-packet/)이 손실되어 [DDoS 공격](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/)의 형태로 악용될 수 있다.

## UDP 동작

모든 [네트워킹 프로토콜](https://www.cloudflare.com/learning/network-layer/what-is-a-protocol/)과 마찬가지로 UDP는 네트워크의 두 컴퓨터 간에 데이터를 전송하기 위한 표준화된 방법이다. 다른 프로토콜과 비교하여 UDP는 먼저 연결을 설정하거나, 해당 패킷의 순서를 표시하거나, 의도한 대로 도착했는지 여부를 확인하지 않고 패킷(데이터 전송 단위)을 대상 컴퓨터로 직접 보내는 간단한 방식으로 이 프로세스를 수행한다. (UDP 패킷을 '데이터그램'이라고 한다.)

## TCP와의 차이

UDP는 또 하나의 일반적인 전송 프로토콜인 [[TCP]]보다 빠르지만, 안정성이 떨어진다. TCP 통신에서 두 컴퓨터는 '핸드셰이크'라는 자동화된 프로세스를 통해 연결을 설정하는 것으로 시작한다. 이 핸드셰이크가 완료된 후에만 실제로 데이터 패킷이 한 컴퓨터에서 다른 컴퓨터로 전송된다.

UDP 통신은 이 프로세스를 거치지 않는다. 대신 한 컴퓨터에서 단순히 다른 컴퓨터로 데이터를 보내기 시작할 수 있다.

![](https://i.imgur.com/Wf3P8J2.png)

또한 TCP 통신은 데이터 패킷이 수신되어야 하는 순서를 나타내고 패킷이 의도한 대로 도착하는지 확인한다. 패킷이 도착하지 않는 경우(예: 중간 네트워크의 혼잡으로 인해) TCP를 다시 보내야 한다. UDP 통신에는 이 기능이 포함되어 있지 않는다.

이러한 차이 때문에 몇 가지 이점이 생깁니다. UDP는 '핸드셰이크'가 필요하지 않거나 데이터가 제대로 도착하는지 확인하지 않기 때문에 TCP보다 훨씬 빠르게 데이터를 전송할 수 있다.

그러나 이 속도 때문에 성능 저하가 생긴다. UDP 데이터그램이 전송 중에 손실되면 다시 전송되지 않는다. 따라서 UDP를 사용하는 애플리케이션은 오류, 손실, 중복을 허용할 수 있어야 한다.

(기술적으로 보면, 이러한 패킷 손실은 UDP의 결함이라기보다는 인터넷 구축 방식의 결과다. 대부분의 네트워크 [라우터](https://www.cloudflare.com/learning/network-layer/what-is-a-router/)는 패킷 순서 지정 및 도착 확인을 의도적으로 수행하지 않는다. 그렇게 할 경우 수행할 수 없는 양의 추가 메모리가 필요하기 때문이다. TCP는 애플리케이션에서 이를 필요로 할 때 이 격차를 메우는 방법이다.)

## UDP의 활용

UDP는 때때로 패킷을 삭제하는 것이 기다리는 것보다 나은 시간에 민감한 통신에 일반적으로 사용된다. 음성 및 비디오 트래픽은 시간에 민감하고 일정 수준의 손실을 처리하도록 설계되었으므로 이 프로토콜을 사용하여 전송되는 경우가 많다. 예를 들어, 많은 인터넷 기반 전화 서비스에서 사용되는 [Voice over IP(VoIP)](https://www.cloudflare.com/learning/video/what-is-voip/)는 일반적으로 UDP를 통해 작동한다. 이는 정적인 전화상의 대화가 뚜렷하게 들리지만 심하게 지연되는 대화보다 선호되기 때문이다.

따라서 UDP는 온라인 게임에도 이상적인 프로토콜이다. 마찬가지로 DNS 서버는 빠르고 효율적이기도 해야 하므로 UDP를 통해서도 작동한다.
