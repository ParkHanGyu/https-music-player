import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import { getPlatformUrl } from "../../utils/mediaUrlHelper";

const Main = () => {
  //    Zustand state : 메인 화면 검색 url 상태    //
  const { searchUrl, setSearchUrl } = useVideoStore();
  //      state: 검색할 url 상태      //
  const [videoUrl, setVideoUrl] = useState<string>("");
  //      event handler: url input값 변경      //
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };
  //      event handler: url 키보드 enter 이벤트 핸들러     //
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      videoSearch();
    }
  };

  //      function: 검색 url 변수 할당 함수    //
  const videoSearch = () => {
    const urlMatch = getPlatformUrl(videoUrl);
    if (urlMatch) {
      setSearchUrl(urlMatch);
    }
  };

  const test1 = () => {
    console.log(searchUrl);
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

              <div className={styles["main-title-box"]} onClick={test1}>
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
