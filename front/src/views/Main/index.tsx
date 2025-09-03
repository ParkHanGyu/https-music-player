import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";

const Main = () => {
  //    Zustand state : 메인 화면 검색 url 상태    //
  const { setSearchUrl } = useVideoStore();
  //    Zustand state : playBar.tsx 관련 상태    //
  const { nowPlayViewState, setNowPlayViewState } = usePlaylistStore();
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

  //      function: 검색 URL 정규화 + 변수 할당 함수    //
  const videoSearch = () => {
    let urlMatch;
    if (videoUrl.includes("youtu")) {
      const youTubeIdMatch = videoUrl.match(
        /(?:youtu\.be\/|(?:v=|.*[?&]v=))([a-zA-Z0-9_-]{11})/
      );
      if (youTubeIdMatch) {
        urlMatch = `https://youtu.be/${youTubeIdMatch[1]}`;
      }
    } else if (videoUrl.includes("soundcloud")) {
      urlMatch = videoUrl;
    }

    if (urlMatch) {
      setSearchUrl(urlMatch);
    } else {
      alert("형식에 맞는 URL을 입력해주세요.");
      return;
    }

    if (nowPlayViewState) {
      setNowPlayViewState(false);
    }
  };

  return (
    <>
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
