import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import useYouTubeIdExtractor from "../../hooks/useYouTubeIdExtractor";
import { getPlatformUrl } from "../../utils/mediaUrlHelper";

const Main = () => {
  const { setUrlId } = useVideoStore();
  const [videoUrl, setVideoUrl] = useState<string>("");
  // 정규식을 사용한 ID추출 커스텀Hook
  const { extractYouTubeId } = useYouTubeIdExtractor();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };
  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      videoSearch();
    }
  };

  // const videoSearch = () => {
  //   // "youtu"을 포함한 경우
  //   if (videoUrl.includes("youtu")) {
  //     const urlMatch = extractYouTubeId(videoUrl);
  //     if (urlMatch) {
  //       // musicInfo에 있는 음악 정보를 set해주기 위해 urlId에 set
  //       setUrlId(urlMatch);
  //     } else {
  //       alert("추출 실패");
  //       return;
  //     }
  //   }
  // };

  const videoSearch = () => {
    // if (videoUrl.includes("youtu")) {
    //   alert("유튜브 url 들어옴");
    //   let urlMatch;

    //   // www이 포함되어 있을때
    //   if (videoUrl.includes("www.")) {
    //     urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
    //   }
    //   // www이 없고 ?si=를 포함할 경우
    //   else if (videoUrl.includes("?si=")) {
    //     urlMatch = videoUrl.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
    //   }
    //   // https://youtu.be/로 시작할 때
    //   else {
    //     urlMatch = videoUrl.match(/(?<=https:\/\/youtu.be\/)[a-zA-Z0-9_-]+/);
    //   }

    // } else if (videoUrl.includes("soundcloud")) {
    //   alert("사클 url 들어옴");

    // }

    // setUrlId(videoUrl);

    console.log("main에서 받은 videoUrl 값 : ", videoUrl);

    const urlMatch = getPlatformUrl(videoUrl);
    console.log("main에서 추출한 url값 : ", urlMatch);

    if (urlMatch) {
      setUrlId(urlMatch);
    }
  };

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-wrap-top-content"]}>
            {/* ================================================== */}
            <div className={styles["main-center"]}>
              <div className={styles["main-search-box"]}>
                <input
                  className={styles["main-search-input"]}
                  type="text"
                  placeholder="Please enter the URL."
                  value={videoUrl}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <div
                  className={styles["main-search-btn"]}
                  onClick={videoSearch}
                ></div>
              </div>

              <div className={styles["main-title-box"]}>
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

export default Main;
