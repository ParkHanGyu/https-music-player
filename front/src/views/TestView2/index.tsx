import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import "../TestView2/testStyle.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";

type PlaylistItem = {
  id: number;
  title: string;
  description: string;
};

const TestView2 = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    { id: 1, title: "Track 1", description: "Artist 1" },
    { id: 2, title: "Track 2", description: "Artist 2" },
    { id: 3, title: "Track 3", description: "Artist 3" },
    { id: 4, title: "Track 4", description: "Artist 4" },
  ]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 드래그 시작
  const handleDragStart = (index: number) => {
    console.log("드래그 시작");
    setDraggedIndex(index);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
    console.log("드래그 중");

    setHoveredIndex(index);

    if (draggedIndex !== null && draggedIndex !== index) {
      const updatedPlaylist = [...playlist];
      const [draggedItem] = updatedPlaylist.splice(draggedIndex, 1);
      updatedPlaylist.splice(index, 0, draggedItem);

      setPlaylist(updatedPlaylist);
      setDraggedIndex(index);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    console.log("드래그 종료");

    setDraggedIndex(null);
    setHoveredIndex(null);
    console.log("Target Position:", hoveredIndex);
  };

  // 드래그 중 기본 동작 방지 (y축 제한)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 동작 방지
  };

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [afterVideoUrl, setAfterVideoUrl] = useState<string>("");
  //      event handler: url input값 변경      //
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const getPlatformUrl = (url: string): string => {
    // 유튜브 URL에서 ID 추출하는 정규식
    const youTubeIdMatch = url.match(
      /(?:youtu\.be\/|(?:v=|.*[?&]v=))([a-zA-Z0-9_-]{11})/
    );

    if (youTubeIdMatch) {
      return `https://youtu.be/${youTubeIdMatch[1]}`;
    } else if (url.includes("soundcloud")) {
      return url;
    }

    // 필요한 경우 다른 플랫폼도 추가 가능
    return url;
  };

  //      function: 검색 url 변수 할당 함수    //
  const videoSearch = () => {
    console.log("정규식 이전 : ", videoUrl);

    const testValue = getPlatformUrl(videoUrl);
    setAfterVideoUrl(testValue);
  };

  const testBTN = () => {
    console.log("정규식 이후 : ", afterVideoUrl);
  };

  const [url, setUrl] = useState<string>("");

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const playerRef = useRef<ReactPlayer | null>(null);

  // useEffect(() => {
  //   const loadWidget = () => {
  //     if (
  //       playerRef.current &&
  //       (window as any).SC &&
  //       (window as any).SC.Widget
  //     ) {
  //       const widget = (window as any).SC.Widget(playerRef.current);
  //       widget.bind((window as any).SC.Widget.Events.FINISH, () => {
  //         console.log("사운드클라우드 트랙 재생 완료");
  //       });
  //     }
  //   };

  //   // SoundCloud API가 없으면 추가
  //   if (!(window as any).SC) {
  //     const script = document.createElement("script");
  //     script.src = "https://w.soundcloud.com/player/api.js";
  //     script.onload = loadWidget;
  //     document.body.appendChild(script);
  //   } else {
  //     loadWidget();
  //   }
  // }, []);

  return (
    <div>
      {/* <iframe
        ref={playerRef}
        title="SoundCloud Player" // title 추가 (ESLint 경고 해결)
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        // src={url} // 유효한 트랙 ID 사용
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1991575247&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true
"
      ></iframe>

      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter media URL (YouTube, SoundCloud, etc.)"
        style={{ width: "100%", padding: "10px" }}
      /> */}

      <ReactPlayer
        ref={playerRef}
        url="https://soundcloud.com/cthruriooo/a-million-prod-1jackpott-x"
        // url="https://www.youtube.com/watch?v=9A_HyE4XsSM"
        playing={true}
        // onBuffer, onBufferEnd 는 url이 set되고 onReady가 실행될때쯤 onBuffer가 실행되서 원하는 타이밍에 로딩을 못걸어줌. 그래서 제외
        // onReady={handleReady}
        // onDuration={handleDuration}
        onEnded={() => {
          console.log("재생 끝");
          console.log("playerRef.current : ", playerRef.current);

          if (playerRef.current) {
            playerRef.current.seekTo(0);
          }
        }}
        // volume={volume}
        // style={{ display: "none" }}
      />

      {/* <div style={{ marginTop: "20px" }}>
        {url && (
          <ReactPlayer
            url={url}
            loop={true}
            config={{
              soundcloud: {
                options: {
                  loop: true,
                },
              },
            }}
          />
        )}
      </div> */}
    </div>
  );
};

export default TestView2;
