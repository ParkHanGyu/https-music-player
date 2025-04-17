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
프로젝트의 핵심 기능은 사용자가 원하는 음악을 원하는 재생목록에 추가하는 기능입니다.

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

    => noembed API를 통해서 음악 정보를 가져옴. 이 정보를 가지는 데이터는 infoData에 저장되어 있습니다.



</br>
</details>


<details>
<summary><b>Noembed를 사용한 음악 정보 얻어오기</b></summary>

![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/2_setMusicInfo.png?raw=true)
  - 직전 정규식에서 searchUrl값이 변경되는데, MusicInfo 컴포넌트의 useEffect가 이를 감지해 useMediaInfo 커스텀훅의 setMusicInfo을 호출합니다. 이때 setMusicInfo은 매개변수 값으로 Zustand를 사용해 상태관리중인 searchUrl을 받습니다.
  - searchUrl의 값으로 noembed API를 통해 음악의 정보를 받아옵니다.
  - 실패할경우 resetInfoData()를 호출해 기본값으로 초기화합니다.
  - 가져온 정보중 vidTitle값이 "soundcloud"를 포함하는 경우 제목에 포함된 불필요한 " by "(아티스트명)를 제거합니다.
  - 정보를 담은 값은 커스텀훅에 useState로 선언한 infoData로 저장하여 상태 관리 됩니다.

    => noembed API를 통해서 음악 정보를 가져옴. 이 정보를 가지는 데이터는 infoData에 저장되어 있습니다.

  


</details>

<details>
<summary><b>Axios 비동기 요청</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/3-2_API_playlistAddMusicRequest.png?raw=true)
  - 직전 커스텀훅을 통해 저장한 미디어 데이터를 비동기 POST 요청을 해줍니다.
  - 이때 POST 요청으로 같이 보내줄 데이터는 미디어 데이터들을 담아둔 requestBody와 보안과 사용자를 구별하기 위해 accessToken을 포함해 서버로 보내줍니다.
  - 성공 시 응답 데이터 반환, 실패 시 에러 응답을 반환 해줍니다.

    => URL의 음악 정보를 가지고 클라이언트에서 서버로 비동기 POST 요청을 합니다.


</details>


</br>


### 4.3. JWT Authentication Filter
<details>
<summary><b>유효한 JWT토큰인지 확인</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/4_JWT_doFilterInternal.png?raw=true)
  - parseBearerToken() 메서드를 사용해 토큰이 올바른 형태인지 확인합니다. (parseBearerToken() 메서드에 대한 내용은 아래 "JWT 토큰 추출" 참고)
  - 정상적인 형태의 토큰이면 parseBearerToken() 메서드의 return 값으로 추출한 토큰값을 받습니다.
  - 추출한 토큰의 정보를 Spring Security가 알 수 있도록 UsernamePasswordAuthenticationToken을 생성해서 SecurityContext에 저장합니다.
  - 서버에서 클라이언트이 요청을 받기 전에 해당 요청이 보안 측면에서 허용하는 요청인지 Spring Security에서 확인합니다. 이때 우리 프로젝트는 몇몇 요청을 제외한 모든 요청에는 토큰을 같이 데이터를 보내줘야 하기 때문에 이번 예시에서는 토큰을 검증해줍니다.
   
    => Spring Security 는 SecurityContext에 저장된걸 확인하여 보안적으로 정상적인 요청인걸 확인합니다.
    
</details>



<details>
<summary><b>JWT 토큰 추출(parseBearerToken메서드)</b></summary>
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/5_JWT_parseBearerToken.png?raw=true)
 - 클라이언트에서 보낸 HTTP 요청 헤더에서 "Authorization" 필드가 존재하는지 확인합니다.
 - "Authorization" 필드가 존재하지 않는다면, parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Authorization" 필드가 존재하는 경우, 해당 값이 "Bearer "로 시작하는지 확인합니다.
 - "Bearer "로 시작하지 않는다면 parseBearerToken 메서드를 호출한곳에 null을 반환합니다.
 - "Bearer "로 시작하는 경우, "Bearer " 이후의 문자열(토큰 값)만 추출하여 반환합니다.


=> 1차적으로  parseBearerToken에서 토큰의 유무와 형태를 확인해주고 정상적이라면 2차적으로 doFilterInternal에서 SecurityContext에 정보를 저장해주는 흐름입니다.


  
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


### 4.5. Service(기능모음 interface)
<details>
<summary><b>음악 추가 Service interface</b></summary> 
  
![](https://github.com/ParkHanGyu/https-music-player/blob/master/assets/7-2_addPlayListToMusic_service_interface.png?raw=true)

 - service interface는 비즈니스 로직을 처리하는 서비스 계층의 인터페이스입니다.
 - 기능을 정의하는 역할을 하며, 실제 기능 구현은 serviceImpl클래스에서 수행됩니다.
</details>

</br>


### 4.6. Service implement(기능구현 Service)
<details>
<summary><b>재생목록 생성 Service 기능구현</b></summary> 

  - 클라이언트에서 받아온 데이터를 파싱합니다.
  - 추가할 음악이 중복인지 체크합니다.
  - 중복이라면 MusicResponse 형태의 응답값인 MusicResponse.existingMusic()을 반환합니다.
  - 추가하려는 음악의 재생목록이 존재하는지 확인하고 존재하다면 해당 재생목록의 리스트를 가져옵니다.
  - 존재하지 않다면 클라이언트에 400 Bad Request 응답을 반환해줍니다.
  - 가져온 음악 리스트에 추가하려는 음악을 포함하여 재생순서를 모두 재할당합니다.
  - 이후 MusicRepoSerivce를 통해 데이터베이스에 저장하기 위한 .save()를 실행해줍니다.
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
<br>
웹서비스에 회원기능이 있으면 회원의 프로필 사진도 본인이 원하는 사진으로 바꾸면 좋을거 같아서 프로필 사진을 변경 할 수 있는 기능을 추가했습니다.

하지만 페이지 렌더링시 회원마다 가지고 있는 고유 프로필 이미지가 렌더링 되지 못하는 상황입니다.
사용자가 업로드한 이미지를 원하는 경로에 저장도 했고 DB에 프로필 사진 데이터도 저장해줬지만 비어있는 사진으로 렌더링되는 상황이였습니다.

확인해보니 프로필 이미지를 저장하는 기능까지만 작성했습니다. 이때까지만 해도 이미지 파일이 정상적으로 저장되고 해당 경로를 데이터베이스와 일치시키면 되는줄 알았지만 저장 이후 새로운 경로의 이미지를 불러오는 과정은 이미지 경로에 대해 브라우저에서 자동으로 리소스 요청(API 요청)을 하는데, 해당 요청에 대해 서버는 이미지 파일을 반환해줘야 합니다.

죽, 브라우저에서 프로필 URL경로로 자동으로 리소스를 요청을 하면 서버에서 해당 요청을 받고 이미지를 클라이언트에 반환을 해줘야 하는데 반환해주는 기능을 작성하지 않은 상황이였습니다.

요청에 맞는 서버 로직을 작성해주고 추가적으로 해당 요청은 인증 없이 허용하도록 설정 해주기로 했습니다. 추후에 추가할 기능에는 로그인 하지 않은 유저도 다른 사람 프로필 사진과 이름을 볼 수 있기 때문입니다.

1. 유저가 이미지 변경
2. 렌더링시 이미지를 불러오지 못함 (브라우저가 자동으로 리소스 요청. 이를 치리 할 서버 로직이 없었음)
3. 브라우저의 요청에 맞는 서버 로직 추가
4. 해당 브라우저 요청은 인증 없이(로그인하지 않아도) 허용하도록 SecurityConfig에 설정
  
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
<br>
    
</details>

<!--  5.2 시작 -->
<details>
  <summary><b>5.2. React Noembed을 사용한 미디어 데이터</b></summary>
  <br>
  사용자는 음악을 듣기 전, 누구의 어떤 음악인지 확인하고 듣기 때문에 미디어 정보가 필요합니다. URL을 입력하면 해당 미디어 정보를 어떻게 가져올지 방식에 대해 고민했습니다.
  YouTube Data API를 고려했지만, 제가 사용자일 경우 youtube만 사용하는게 너무 제한적이라 다양한 플랫폼을 지원하는 React Noembed를 사용했습니다.
  음악 정보를 얻기 위해 URL을 기반으로 외부 API(Noembed)를 사용해 해당 미디어의 데이터들을 가져오도록 작성했습니다.
  React Noembed은 다양한 미디어 플랫폼(YouTube, SoundCloud, Vimeo 등) 지원하고 JSON 형식으로 썸네일, 제목, 작성자 등의 정보 제공하는 외부 API입니다. 하지만 플랫폼마다 추출해서 가져온 데이터를 보면 조금씩 다른게 있었습니다.
  
  가져온 데이터에 title를 확인하면 Youtube는 정확히 "title"만 가져오고 SoundCloud 같은 경우 "title by 작성자" 형태로 들어옵니다. 실제로 들어온 값을 보면
  
  ![](https://quasar-cast-348.notion.site/image/attachment%3Ae609afc2-281f-4f66-b964-3399c765b067%3Aimage.png?table=block&id=1d0592ef-3df8-80a2-8d92-dcd864fc15d3&spaceId=39090451-6faf-4dcf-8e9d-b7ae157c5414&width=1160&userId=&cache=v2)
  
  Youtube 같은 경우 미디어의 제목만 vidTitle에 들어가지만 SoundCloud 같은 경우 title + “by” + author 조합을 가진 값을 vidTitle에 set해줍니다. 여기서 생기는 문제는 플랫폼이 SoundCloud인 경우 vidTitle 부분에 조합으로 불필요한 데이터가 들어간다는 것입니다. 
  왜냐하면 이미 author에 업로드자의 정보가 있는데 vidTitle에도 정보를 포함한다는게 굉장히 불편했습니다.
  그래서 URL의 플랫폼이 SoundCloud일 경우 순수 title만 vidTitle에 set해주기 위한 코드 개선이 필요했습니다.
  
1. URL의 미디어 정보 필요
2. Noembed 외부 API를 사용해 정보를 가져옴
3. 플랫폼 마다 받아오는 데이터 형식이 조금 다름
4. 커스텀훅으로 받아온 데이터중 title 부분을 수정



  
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
    - SoundCloud의 경우 제목(title)이 "곡명 by 아티스트명" 형식이기 때문에 " by "를 기준으로 잘라서 "곡명"만 남겼습니다. 예를 들어, title = "제목 by 작성자" 라면 → "제목"만 저장됩니다.
    - 만약 SoundCloud의 제목에 by가 없을수도 있기 때문에 if문 조건으로 title의 문자열 값에 " by " 가 있는지 확인하고 " by "가 없는 SoundCloud URL이라면 title이 그대로 사용됩니다.
    - YouTube일 경우 title이 그대로 사용됩니다.
    
    </div>
    </details>
      <br>
</details>

<!--  5.2 끝 -->

<!--  5.3 시작 -->
<details>
  <summary><b>5.3. 미디어 플랫폼별 반복재생 문제</b></summary>
  <br>
  해당 프로젝트는 미디어 소스를 재생할 수 있는 React용 미디어 플레이어 컴포넌트인 ReactPlayer를 사용해 미디어를 재생하고 ReactPlayer의 옵션을 사용해 제어 할 수 있습니다.
  
  ReactPlayer에 옵션을 보면 playing, onReady, onDuration, onEnded, loop, .. 등을 통해 미디어를 제어 할 수 있는데 반복재생에 대한 옵션은 loop 옵션을 통해 구현했습니다.
  
  하지만 URL의 플랫폼이 Youtube인 경우에는 loop 옵션이 작동 했지만 SoundCloud에서는 작동하지 않는 상황입니다.
  
  확인해보니 Youtube같은 경우 ReactPlayer의 옵션인 loop에 대한 기능을 지원하지만 SoundCloud에서는 loop에 대한 기능을 제공하지 않기 때문에 loop 옵션을 사용해 반복재생을 구현 할 수 없었습니다.
  
  여러 옵션들을 사용해보니 플랫폼이 달라도 공통적으로 작동할 수 있는 옵션 중 하나인 onEnded를 사용하여 반복재생 기능을 구현하기로 했습니다. onEnded은 미디어 재생이 끝나면 호출되는 옵션입니다.


1. ReactPlayer의 옵션인 loop를 사용해 반복재생 구현
2. 특정 플랫폼은 loop옵션을 사용할 수 없음
3. ReactPlayer의 옵션인 onEnded을 사용해 반복재생 구현
  
    <details>
    <summary><b>기존 코드</b></summary>
    <div markdown="1">
    
    ~~~typescript 
    /**
      PlayBar.tsx
     */
    const handleEnded = () => {
      onNextMusic();
    };
  
    return(
      <ReactPlayer
        ref={playerRef}
        url={playBarUrl}
        playing={isPlaying}
        onReady={handleReady}
        onDuration={handleDuration}
        loop={isLoop}
        onEnded={handleEnded}
        volume={volume}
        style={{ display: "none" }}
      />
    )
    ~~~
  
      
    </div>
    </details>

  
    <details>
    <summary><b>개선된 코드</b></summary>
    <div markdown="1">
    
    ~~~typescript
    /**
      PlayBar.tsx
    */
    const handleEnded = () => {
      if (playerRef.current && isLoop) {
        if (playBarUrl.includes("soundcloud")) {
          setPlayBarUrl(""); 
          setTimeout(() => setPlayBarUrl(playBarUrl), 10);
        } else {
          playerRef.current.seekTo(0);
        }
      } else if (!isLoop) {
        onNextMusic();
      }
    };
  
    return(
      <ReactPlayer
        ref={playerRef}
        url={playBarUrl}
        playing={isPlaying}
        onReady={handleReady}
        onDuration={handleDuration}
        onEnded={handleEnded}
        volume={volume}
        style={{ display: "none" }}
      />
    )
    ~~~
    - 기존 ReactPlayer에서 사용하던 loop 옵션을 제거하고 반복재생 여부에 따른 동작을 handleEnded() 메서드에서 처리하도록 수정
    - 만약 isLoop가 true이고 URL이 "soundcloud"인 경우 ReactPlayer의 URL값을 초기화해주고 setTimeout 콜백 함수를 호출하여 일정 시간 후에 URL을 업데이트합니다.
    - 만약 isLoop가 true이고 URL이 "soundcloud"가 아닌 경우(해당 프로젝트에서는 youtube인 경우) 해당 미디어의 진행도를 0으로 수정해줍니다.
    - 마지막 else if 조건문을 보면 기존 코드인 ReactPlayer의 옵션인 loop가 ture일경우 onEnded 옵션이 실행되지 않습니다. 결국 기존 코드에서 onEnded가 실행되려면 기본적으로 loop 값이 false입니다.
    - 하지만 수정 코드인 ReactPlayer을 보면 loop옵션을 사용하고 있지 않기 때문에 항상 onEnded가 실행되고 isLoop값에 따른 반복재생 또는 다음 음악으로 넘어가는 흐름으로 작성해줬습니다. 
    </div>
    </details>
      <br>
</details>

<!--  5.3 끝 -->


<!--  5.4 시작 -->
<details>
  <summary><b>5.4. 재생목록 순서 변경</b></summary>
  <br>
음악 순서를 어떤 기준으로 정렬할까라는 의문에 orderValue라는 컬럼을 만들어 orderValue 기준으로 정렬해주었습니다. 그리고 사용자가 음악 순서를 변경하면 변경하려는 음악 위치에 전,후 노래의 orderValue값을 추출해 새로운 orderValue 값을 생성하고 DB에 업데이트 해주는 형식으로 진행하였습니다. 

하지만 순서를 변경하다 보면 언젠가 orderValue값이 중복인 경우가 생기는데 그럴때 해당 재생목록의 모든 음악이 가지고 있는 orderValue값을 10단위로 다시 정렬해주고 저장해주는 로직을 작성했었습니다. 매번 다시 orderValue값을 정렬을 해주면 소소한 기능 저하가 있을것 같아 orderValue 값의 10의 자리가 1 또는 9일때만 정렬해주는식으로 작성했었습니다.

하지만 재정렬 기준이 1 또는 9로 해뒀던게 문제가 있었습니다.  1 또는 9 말고 이외에도 중복되는 확률이 있고 결국 orderValue값의 중복이 생겼습니다. 그렇기 때문에 이에 대한 수정이 필요 했습니다.

1. 음악 순서를 정해주기 위해 DB에 orderValue 컬럼을 추가
2. 음악 순서를 수정하다 보면 orderValue가 중복되어 순서가 바뀌지 않는 상황 발생
3. 음악 순서를 변경할때 orderValue 값을 재배치 해주는 로직 추가

  
  <details>
  <summary><b>기존 코드</b></summary>
  <div markdown="1">
  
  ~~~java 
  @Override
     public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email) {
         List<PlaylistMusic> playlistMusics = playlistMusicRepoService.findByPlaylistIdOrderByOrderValue(playlistId);

         int hoveredIndex = request.getHoveredIndex();
         int newOrderValue;
         int previousOrderValue;
         int nextOrderValue;
 
         int dragItemIndex = IntStream.range(0, playlistMusics.size())
                 .filter(i -> playlistMusics.get(i).getMusicId().equals(request.getMusicId()))
                 .findFirst()
                 .orElse(-1); 
         if (dragItemIndex == -1) {
             System.out.println("해당 musicId에 해당하는 음악을 찾을 수 없습니다.");
             return null;
         }

         if (hoveredIndex == 0) { 
             int firstOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
             newOrderValue = firstOrderValue / 2;
         } else if (hoveredIndex + 1 >= playlistMusics.size()) { 


             int lastOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
             newOrderValue = lastOrderValue + 10;
 
         } else {
             int dragItemOrderValue = playlistMusics.get(dragItemIndex).getOrderValue();
             int existingItemOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
             log.info("dragItemOrderValue = {}, testValue2 = {}",dragItemOrderValue, existingItemOrderValue);
 
             if(dragItemOrderValue < existingItemOrderValue) { 
                 previousOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
                 nextOrderValue = playlistMusics.get(hoveredIndex + 1).getOrderValue();
 
             } else {
                 previousOrderValue = playlistMusics.get(hoveredIndex - 1).getOrderValue();
                 nextOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
             }
 
             newOrderValue = (previousOrderValue + nextOrderValue) / 2;
         }
         playlistMusics.get(dragItemIndex).setOrderValue(newOrderValue);



         if (newOrderValue % 10 == 1 || newOrderValue % 10 == 9) {
             reorderPlaylist(playlistMusics); 
         } else { 
             playlistMusicRepoService.save(playlistMusics.get(dragItemIndex));
         }
          return UpdateOrderValueResponse.success();
     }
 
 
     private void reorderPlaylist(List<PlaylistMusic> playlistMusics) {
			   playlistMusics.sort(Comparator.comparingInt(PlaylistMusic::getOrderValue));
 
         int orderValue = 10;
         log.info("=== 재배치 시작 ===");
 
         for (PlaylistMusic pm : playlistMusics) {
             pm.setOrderValue(orderValue);
             log.info("Music ID: {}, Title: {}, New OrderValue: {}",
                     pm.getMusicId(),
                     pm.getMusic().getTitle(),
                     orderValue);
             orderValue += 10;
         }
                 playlistMusicRepoService.saveAll(playlistMusics);
         log.info("=== 재배치 완료 ===");
  ~~~

    
  </div>
  </details>

  
  <details>
  <summary><b>개선된 코드</b></summary>
  <div markdown="1">
  
  ~~~java
  @Override
public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email) {
    List<PlaylistMusic> playlistMusics = playlistMusicRepoService.findByPlaylistIdOrderByOrderValue(playlistId);
    if (playlistMusics.isEmpty()) {
        throw new PlaylistMusicNotFoundException();
    }
    int hoveredIndex = request.getHoveredIndex();
    int newOrderValue;
    int previousOrderValue;
    int nextOrderValue;

    int dragItemIndex = IntStream.range(0, playlistMusics.size())
            .filter(i -> playlistMusics.get(i).getMusicId().equals(request.getMusicId())) 
            .orElse(-1);
    if (dragItemIndex == -1) {
        throw new MusicIdNotFoundException();
    }

    if (hoveredIndex == 0) { 
        int firstOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
        newOrderValue = firstOrderValue / 2;
    } else if (hoveredIndex + 1 >= playlistMusics.size()) { 
        int lastOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
        newOrderValue = lastOrderValue + 10;

    } else {  
        int dragItemOrderValue = playlistMusics.get(dragItemIndex).getOrderValue();
        int existingItemOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
        if(dragItemOrderValue < existingItemOrderValue) {
            previousOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            nextOrderValue = playlistMusics.get(hoveredIndex + 1).getOrderValue();

        } else {
            previousOrderValue = playlistMusics.get(hoveredIndex - 1).getOrderValue();
            nextOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
        }
        newOrderValue = (previousOrderValue + nextOrderValue) / 2;
    }
    
    reorderPlaylist(playlistMusics); 
    playlistMusicRepoService.updatePlaylist(playlistMusics);

    return UpdateOrderValueResponse.success();
}

  ~~~

  </div>
  </details>
    <br>
</details>

<!--  5.4 끝 -->

</br>

## 6. 회고 / 느낀점
<!--tistory-->
>프로젝트 회고 </br>
	<a href="https://qkrgksrl0033.tistory.com/23" target="_blank" rel="noopener noreferrer">
	  <img src="https://img.shields.io/badge/Tistory-000000?style=flat-square&logo=tistory&logoColor=FC4C02"/>
	</a> </br>
  



<!--Notion-->
>프로젝트 현황판 </br>
	<a href="https://quasar-cast-348.notion.site/https-music-player-1ce592ef3df880d8a77dede5a5cdecb8" target="_blank" rel="noopener noreferrer">
	  <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion&logoColor=white"/>
	</a>




</br>

