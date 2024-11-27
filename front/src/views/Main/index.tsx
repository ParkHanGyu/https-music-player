import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import useYouTubeIdExtractor from "../../hooks/useYouTubeIdExtractor";

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

  const videoSearch = () => {
    // "youtu"을 포함한 경우
    if (videoUrl.includes("youtu")) {
      const urlMatch = extractYouTubeId(videoUrl);
      if (urlMatch) {
        // musicInfo에 있는 음악 정보를 set해주기 위해 urlId에 set
        setUrlId(urlMatch);
      } else {
        return;
      }
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
