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

</br>


### 4.2. 사용자 요청
<details>
<summary><b>URL 정규식 체크</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/1_videoSearch.png?raw=true)
  - React로 렌더링된 화면에서 사용자가 검색을 시도한 URL이 Youtube인지, SoundCloud인지 정규식으로 확인합니다.
  - URL이 Youtube 또는 SoundCloud인 경우 이후 Noembed을 사용해서 노래 정보를 받아와야 하기 때문에 Noembed에서 사용하는 형식에 맞게 URL을 정규화 시켜줍니다.
  - 정규화 시켜준 URL을 다른 컴포넌트에서 사용 할 수 있게 Zustand를 사용해 정규화한 URL를 set해줍니다.
  - Youtube 또는 SoundCloud 아닌 URL인 경우, 에러 메세지를 띄웁니다.

</br>
</details>


<details>
<summary><b>Noembed를 사용한 음악 정보 얻어오기</b></summary>

![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/2_setMusicInfo.png?raw=true)
  - useState를 사용해 infoData라는 상태를 관리합니다.
  - SoundCloud일 경우 제목에 포함된 불필요한 "by"(아티스트명)를 제거합니다.
  - setMusicInfo(url)을 호출하면 해당 URL의 미디어 정보를 가져와 infoData에 저장합니다.
  - 데이터를 가져올 때 noembed API를 이용하여 URL의 미디어 정보를 가져옵니다.
  - 실패하면 resetInfoData()를 호출해 기본값으로 초기화합니다.
  


</details>

<details>
<summary><b>Axios 비동기 요청</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/3-2_API_playlistAddMusicRequest.png?raw=true)
  - Noembed를 통해 가져온 미디어 데이터를 비동기로 POST 요청해줍니다.
  - 이때 POST 요청으로 같이 보내줄 데이터는 미디어 데이터들을 담아둔 requestBody와 보안과 사용자를 구별하기 위해 accessToken을 포함해 서버로 보내줍니다.
  - 성공 시 응답 데이터 반환, 실패 시 에러 응답을 반환 해줍니다.
</details>


</br>


### 4.3. JWT Authentication Filter
<details>
<summary><b>JWT 토큰 추출</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/4_JWT_parseBearerToken.png?raw=true)
 - 클라이언트에서 보낸 HTTP 요청 헤더에서 "Authorization" 필드가 존재하는지 확인합니다.
 - "Authorization" 필드가 존재하지 않는다면, parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Authorization" 필드가 존재하는 경우, 해당 값이 "Bearer "로 시작하는지 확인합니다.
 - "Bearer "로 시작하지 않는다면 parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Bearer "로 시작하는 경우, "Bearer " 이후의 문자열(토큰 값)만 추출하여 반환합니다. 
  
</details>

<details>
<summary><b>JWT 토큰 유효한 토큰인지 확인</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/5_JWT_doFilterInternal.png?raw=true)
</details>

</br>

### 4.4. Controller
<details>
<summary><b>재생목록 생성 Controller</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/6-1_controller_createPlayList.png?raw=true)
</details>

</br>


### 4.5. Service
<details>
<summary><b>재생목록 생성 Service 기능 정의</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/7_service_interface.png?raw=true)
</details>

</br>


### 4.6. Service Implementation
<details>
<summary><b>재생목록 생성 Service 기능 구현</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/8_service_impl.png?raw=true)
</details>


</br>


### 4.7. Repository
<details>
<summary><b>재생목록 생성 Repository</b></summary> 
RepoSerivce에서 DB에 접근할 수 있는 로직들을 작성해주고 
실제로 DB에 접근하는 부분은 Repository에 작성해줬다. 
</br>

  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/9_repository_DB.png?raw=true)
</details>

</div>
</details>
