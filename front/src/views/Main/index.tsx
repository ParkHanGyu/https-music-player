import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import { getPlatformUrl } from "../../utils/mediaUrlHelper";

const Main = () => {
  const { setSearchUrl } = useVideoStore();
  const [videoUrl, setVideoUrl] = useState<string>("");
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
    const urlMatch = getPlatformUrl(videoUrl);
    if (urlMatch) {
      setSearchUrl(urlMatch);
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
