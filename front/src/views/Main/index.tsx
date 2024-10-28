import React, { useState } from "react";
import styles from "./style.module.css";
import MusicInfo from "../../layouts/MusicInfo";
import { useVideoStore } from "../../store/useVideoStore";

const Main = () => {
  const { setUrlId } = useVideoStore();

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const videoSearch = () => {
    // "youtu"을 포함한 경우
    if (videoUrl.includes("youtu")) {
      if (videoUrl.includes("www.")) {
        const urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
        if (urlMatch) {
          setUrlId(urlMatch[0]);
        } else {
          alert("v=이 없을 경우 실행. urlMatch 값 : " + urlMatch);
          return;
        }
      } else {
        setIsPlaying(!isPlaying);
      }
    } else {
      // "youtu"를 포함하지 않은 경우
      alert("유튜브 url이 아님");
      return;
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

          {/* <MusicInfo /> */}
        </div>
      </div>
    </>
  );
};

export default Main;
