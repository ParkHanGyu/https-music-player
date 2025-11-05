import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";

const Main = () => {
  //    Zustand state : 메인 화면 검색 url 상태    //
  const { setMainSearchUrl } = useVideoStore();
  //    Zustand state : playBar.tsx 관련 상태    //
  const { playBarModeState, setPlayBarModeState } = usePlaylistStore();
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
      // 1-1 유튜브일때 ->
      const youTubeIdMatch = videoUrl.match(
        /(?:youtu\.be\/|(?:v=|.*[?&]v=))([a-zA-Z0-9_-]{11})/
      );

      // 1-2 id값만 추출
      if (youTubeIdMatch) {
        urlMatch = `https://youtu.be/${youTubeIdMatch[1]}`;
      }

      // 2-1 사운드클라우드일때 -> url 그대로 사용
    } else if (videoUrl.includes("soundcloud")) {
      urlMatch = videoUrl;
    }

    // 3. 위에 값들을 추출했을때 값이 있다면
    if (urlMatch) {
      // 3-1.Zustand로 관리중인 state에 값 저장
      setMainSearchUrl(urlMatch);
    } else {
      // 3-2. 없다면 옳바른 url이 아니니 alert
      alert("형식에 맞는 URL을 입력해주세요.");
      return;
    }

    // 4. Zustand로 관리중인 searchMusic 컴포넌트 상태 변경
    // ture-> false
    if (playBarModeState) {
      setPlayBarModeState(false);
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
