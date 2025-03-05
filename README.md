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
<summary><b>유효한 JWT토큰인지 확인</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/4_JWT_doFilterInternal.png?raw=true)
  - parseBearerToken() 메서드를 사용해 토큰이 올바른 형태인지 확인합니다. (parseBearerToken() 메서드에 대한 내용은 아래 "JWT 토큰 추출" 참고)
  - 정상적인 형태의 토큰이면 parseBearerToken() 메서드의 return 값으로 추출한 토큰값을 받습니다.
  - 추출한 토큰의 정보를 Spring Security가 알 수 있도록 UsernamePasswordAuthenticationToken을 생성해서 SecurityContext에 저장합니다.
    
</details>



<details>
<summary><b>JWT 토큰 추출(parseBearerToken메서드)</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/5_JWT_parseBearerToken.png?raw=true)
 - 클라이언트에서 보낸 HTTP 요청 헤더에서 "Authorization" 필드가 존재하는지 확인합니다.
 - "Authorization" 필드가 존재하지 않는다면, parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Authorization" 필드가 존재하는 경우, 해당 값이 "Bearer "로 시작하는지 확인합니다.
 - "Bearer "로 시작하지 않는다면 parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Bearer "로 시작하는 경우, "Bearer " 이후의 문자열(토큰 값)만 추출하여 반환합니다. 
  
</details>

</br>

### 4.4. Controller
<details>
<summary><b>음악 추가 Controller</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/6-2_controller_addPlaylistToMusic.png?raw=true)
  
  - **요청 처리** 
    - Controller에서는 Spring Security가 허용한 요청을 받고 Service 계층으로 전달합니다.


  - **결과 응답** 
    - Service 계층에서 처리된 결과를 받아 MusicResponse 형태의 응답값을 클라이언트에 반환해줍니다.
    - 여기서 MusicResponse는 성공/실패의 여부를 알 수 있는 code와 message를 담고 있습니다.

</details>

</br>


### 4.5. Service(Service interface 기능 모음)
<details>
<summary><b>음악 추가 Service interface</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/7-2_addPlayListToMusic_service_interface.png?raw=true)

 - service interface는 비즈니스 로직을 처리하는 서비스 계층의 인터페이스입니다.
 - 기능을 정의하는 역할을 하며, 실제 기능 구현은 serviceImpl클래스에서 수행됩니다.
</details>

</br>


### 4.6. Service implement(Service 구현체)
<details>
<summary><b>재생목록 생성 Service 기능 구현</b></summary> 

  - 클라이언트에서 받아온 데이터를 파싱합니다.
  - 추가할 음악이 중복인지 체크합니다.
  - 중복이라면 MusicResponse 형태의 응답값인 MusicResponse.existingMusic()을 반환합니다.
  - 추가하려는 음악의 재생목록이 존재하는지 확인하고 존재하다면 해당 재생목록의 리스트를 가져옵니다.
  - 존재하지 않다면 클라이언트에 400 Bad Request 응답을 반환해줍니다.
  - 가져온 음악 리스트에 추가하려는 음악을 포함하여 재생순서를 계산해 할당해줍니다.
  - 재생순서를 할당해주고 데이터베이스에 저장해줍니다.
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/8-2_addPlayListToMusic_service_impl.png?raw=true)
</details>


</br>


### 4.7. Repository
<details>
<summary><b>재생목록 생성 Repository</b></summary> 
  
  - MusicRepoSerivce는 비즈니스 로직을 담당하며, MusicRepository를 통해 데이터베이스와 상호작용합니다
  - MusicRepository는 JpaRepository를 상속받아 기본적인 CRUD 작업을 수행할 수 있도록 해줍니다.
  - 상속 받은 JpaRepository의 save 메서드를 실행합니다.


![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/9-2_addPlayListToMusic_repository_DB.png?raw=true)
</details>

</br>

</div>
</details>

</br>


## 5. 트러블 슈팅
<details>
  <summary><b>5.1. 페이지 렌더링시 회원 프로필 사진 문제</b></summary>

  - 웹서비스에 회원기능이 있으면 회원의 프로필 사진도 본인이 원하는 사진으로 바꾸면 좋을거 같아서 프로필 사진을 변경 할 수 있는 기능을 추가했습니다.
  
  - 하지만 사용자가 업로드한 이미지를 원하는 경로에 저장도 했고 DB에 프로필 사진 데이터도 저장해줬지만 비어있는 사진으로 렌더링되는 상황이였습니다. 
  
  - 확인해보니 브라우저에서 프로필 사진 부분 div의 backgroundImage가 브라우저에서 자동으로 리소스를 요청했습니다.
  
  - Spring Security는 기본적으로 .requestMatchers("도메인").permitAll()에 작성한 도메인을 제외한 모든 요청을 보호합니다.
  
  - 즉, 브라우저는 background-image: url(...)에서 url(...) 내부의 리소스를 네트워크 요청(GET)을 통해 가져오기 때문에 해당 경로도 HTTP 요청 인증/인가를 설정을 해줘야 했습니다.
  
  <details>
  <summary><b>기존 코드</b></summary>
  <div markdown="1">
  
  ~~~java
  /**
    SecurityConfig.java
   */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) 
                .authorizeRequests(authz -> authz
                        .requestMatchers(HttpMethod.POST,"/api/auth/sign-up", "/api/auth/sign-in").permitAll()
                        .anyRequest().authenticated()  // 그 외 요청은 인증 필요
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // 필터
  
        return http.build();
    }
  ~~~
  
  </div>
  </details>
  
  <details>
  <summary><b>개선된 코드</b></summary>
  <div markdown="1">
  
  ~~~java
  /**
    SecurityConfig.java
   */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeRequests(authz -> authz
                        .requestMatchers(HttpMethod.GET,"/file/image/**").permitAll() // 이미지 경로 인증 없이 접근할 수 있도록 허용
                        .requestMatchers(HttpMethod.POST,"/api/auth/sign-up", "/api/auth/sign-in").permitAll()
                        .anyRequest().authenticated()  // 그 외 요청은 인증 필요
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // 필터 등록
  
        return http.build();
    }
  ~~~
  
  </div>



  
  </details>
</details>

<details>
  <summary><b>5.2. React Noembed을 사용한 미디어 데이터</b></summary>

  - 사용자는 음악을 듣기 전, 누구의 어떤 음악인지 확인하고 듣기 때문에 미디어 정보가 필요합니다.
  - URL을 입력하면 해당 미디어 정보를 어떻게 가져올지 방식에 대해 고민했습니다.
  - YouTube Data API를 고려했지만, 제가 사용자일 경우 youtube만 사용하는게 너무 제한적이라 다양한 플랫폼을 지원하는 React Noembed를 사용했습니다.
  - React Noembed은 다양한 미디어 플랫폼(YouTube, SoundCloud, Vimeo 등) 지원하고 JSON 형식으로 썸네일, 제목, 작성자 등의 정보 제공해줍니다.
  - 하지만 문제는 여기서 Noembed을 썻을때 YouTube와 SoundCloud가 조금 다른게 있습니다.
  - 가져온 데이터에 title를 확인하면 Youtube는 정확히 "title"만 가져오고 SoundCloud 같은 경우 "title by 작성자" 형태로 가져옵니다.
    - 기존 Noembed을 통한 SoundCloud URL의 정보를 가져온 경우(vidTitle의 값을 보면 "by" 뒤에 오는 문자열은 author에 있는 글과 같다.)
    ![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/SoundCloud_by_before%20.PNG?raw=true)
    
  - 그러므로 SoundCloud에 대한 title 데이터는 "by 작성자"를 제외한 문자열을 가져오게 수정했습니다.


  
  <details>
  <summary><b>기존 코드</b></summary>
  <div markdown="1">
  
  ~~~typescript 
  /**
    useMediaInfo.ts
   */
  const noEmbed = "https://noembed.com/embed?url=";
  // 커스텀 훅: useMediaInfo (YouTube, SoundCloud 모두 지원)
  const useMediaInfo = (defaultImage: string) => {
    const [infoData, setInfoData] = useState<MusicInfoData>({
      vidUrl: "-",
      author: "-",
      thumb: defaultImage,
      vidTitle: "-",
    });
  
    const setMusicInfo = (
      url: string,
      callback?: (data: MusicInfoData) => void
    ) => {
      const fullUrl = `${noEmbed}${url}`;
      fetch(fullUrl)
        .then((res) => res.json())
        .then((data) => {
          const { url, author_name, thumbnail_url, title } = data;
          const newInfoData = {
            vidUrl: url || "-",
            author: author_name || "-",
            thumb: thumbnail_url || defaultImage,
            vidTitle: title || "-",
          };
  
          setInfoData(newInfoData);
          if (callback) callback(newInfoData); // 데이터 준비 후 콜백 호출
        })
        .catch((error) => {
          console.error("Failed to fetch media info:", error);
          resetInfoData();
        });
    };
  
    const resetInfoData = () => {
      setInfoData({
        vidUrl: "-",
        author: "-",
        thumb: defaultImage,
        vidTitle: "-",
      });
    };
  
    return {
      infoData,
      setInfoData,
      setMusicInfo,
      defaultImage,
      resetInfoData,
    };
  };
  
  export default useMediaInfo;
  ~~~
  
  </div>
  </details>

  - SoundCloud의 경우 제목(title)이 "곡명 by 아티스트명" 형식이기 때문에 " by "를 기준으로 잘라서 "곡명"만 남겼습니다. 예를 들어, title = "제목 by 작성자" 라면 → "제목"만 저장됩니다.
  - 만약 SoundCloud의 제목에 by가 없을수도 있기 때문에 if문 조건으로 title의 문자열 값에 " by " 가 있는지 확인하고 " by "가 없는 SoundCloud URL이라면 title이 그대로 사용됩니다.
  - YouTube일 경우 title이 그대로 사용됩니다.
  
  <details>
  <summary><b>개선된 코드</b></summary>
  <div markdown="1">
  
  ~~~typescript
  /**
    useMediaInfo.ts
   */
    const noEmbed = "https://noembed.com/embed?url=";
  // 커스텀 훅: useMediaInfo (YouTube, SoundCloud 모두 지원)
  const useMediaInfo = (defaultImage: string) => {
    const [infoData, setInfoData] = useState<MusicInfoData>({
      vidUrl: "-",
      author: "-",
      thumb: defaultImage,
      vidTitle: "-",
    });
  
    const setMusicInfo = (
      url: string,
      callback?: (data: MusicInfoData) => void
    ) => {
      const fullUrl = `${noEmbed}${url}`;
      fetch(fullUrl)
        .then((res) => res.json())
        .then((data) => {
          const { url, author_name, thumbnail_url, title } = data;
          let processedTitle = title || "-";
          if (
            url.includes("soundcloud") &&
            title &&
            author_name &&
            title.includes(" by ") &&
            title.includes(author_name)
          ) {
            processedTitle = title.split(" by ")[0].trim();
          }
  
          const newInfoData = {
            vidUrl: url || "-",
            author: author_name || "-",
            thumb: thumbnail_url || defaultImage,
            vidTitle: processedTitle || "-",
          };
  
          setInfoData(newInfoData);
          if (callback) callback(newInfoData); // 데이터 준비 후 콜백 호출
        })
        .catch((error) => {
          console.error("Failed to fetch media info:", error);
          resetInfoData();
        });
    };
  
    const resetInfoData = () => {
      setInfoData({
        vidUrl: "-",
        author: "-",
        thumb: defaultImage,
        vidTitle: "-",
      });
    };
  
    return {
      infoData,
      setInfoData,
      setMusicInfo,
      defaultImage,
      resetInfoData,
    };
  };
  
  export default useMediaInfo;

  ~~~
  
  </div>
  </details>
</details>











  
  </details>
</details>


</br>

