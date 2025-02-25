# :pushpin: https-music-player : 음악 스트리밍 웹 서비스

</br>

## 1. 제작 기간 & 참여 인원
- 2024년 10월 11일 ~ 2025년 2월 10일
- 개인 프로젝트

</br>

## 2. 사용 기술
#### `Back-end`
  - Java 17
  - Spring Boot 3.3.4
  - Gradle
  - Spring Data JPA
  - Spring Security
  - JWT
  - RESTful API
  - H2
  - MariaDB 10.11.9
#### `Front-end`
  - React
  - JavaScript
  - TypeScript
  - Axios
  - React Cookie
  - React Router DOM
  - Zustand


</br>

## 3. ERD 설계

![image](https://github.com/user-attachments/assets/8cd6a3db-e5a0-41a6-b563-507eaea6d5d8)


## 4. 핵심 기능
이번 프로젝트의 핵심 기능은 음악 검색과 추가 입니다.</br>
사용자는 원하는 음악의 URL을 입력하고, 유효한 URL이면 재생을 통해 음악을 듣거나 원하는 본인만에 재생목록에 추가 할 수 있습니다.</br>
서비스가 어떻게 동작하는지 알 수 있게 흐름도를 참고해주세요.</br>


<details>
<summary><b>핵심 기능 설명</b></summary>
<div markdown="1">

### 4.1. 전체 흐름
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/basic_flow.PNG?raw=true)


### 4.2. 사용자 요청
- **URL 정규식 체크** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/1_getPlatformUrl.png?raw=true)

- **Noembed를 사용한 음악 정보 얻어오기** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/2_setMusicInfo.png?raw=true)

- **Axios 비동기 요청** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/3-1_API_playlistCreateRequest.png?raw=true)


### 4.3. JWT Authentication Filter
- **JWT 토큰 형태 확인** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/4_JWT_parseBearerToken.png?raw=true)

- **JWT 토큰 유효한 토큰인지 확인** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/5_JWT_doFilterInternal.png?raw=true)


### 4.4. Controller
- **재생목록 생성 Controller** :pushpin: [코드 확인]()
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/6-1_controller_createPlayList.png?raw=true)



</div>
</details>
