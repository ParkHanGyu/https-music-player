import { useState } from "react";
import styles from "./style.module.css";
import "../TestView2/testStyle.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

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
  return (
    <>
      <div style={{ width: "400px", margin: "0 auto" }}>
        <h2>Playlist</h2>
        <div>
          {playlist.map((item, index) => (
            <div
              className="testDiv1"
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver} // y축 제한 추가
              style={{
                backgroundColor:
                  draggedIndex === index
                    ? "rgb(0, 0, 0)" // 드래그 중 배경색
                    : hoveredIndex !== null && hoveredIndex === index // hoveredIndex가 null이 아닌 경우만 비교
                    ? "#a71919" // 드래그 중인 아이템이 다른 아이템 위로 들어갔을 때 배경색
                    : "#fff", // 기본 배경색
              }}
            >
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: 0 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-wrap-top-content"]}>
            <div className={styles["main-center"]}>
              <div className={styles["main-search-box"]}>
                <input
                  className={styles["main-search-input"]}
                  type="text"
                  placeholder="Please enter the URL."
                  value={videoUrl}
                  onChange={handleInputChange}
                />
                <div className={"main-search-btn"} onClick={videoSearch}></div>
              </div>

              <div className={"main-title-box"} onClick={testBTN}>
                To get started, please enter the URL of the video you'd like to
                play. This will allow us to retrieve and display the video's
                information so you can begin listening.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestView2;
