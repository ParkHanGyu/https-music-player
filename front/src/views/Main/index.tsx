import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";

const Main = () => {
  const { setUrlId } = useVideoStore();

  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const videoSearch = () => {
    // "youtu"을 포함한 경우
    // if (videoUrl.includes("youtu")) {
    // // www으로 시작할때
    // if (videoUrl.includes("www.")) {
    //   const urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
    //   if (urlMatch) {
    //     setUrlId(urlMatch[0]);
    //   } else {
    //     return;
    //   }
    // }

    // // www으로 시작하지 않을때
    // if (!videoUrl.includes("www.")) {
    //   const urlMatch = videoUrl.match(
    //     /(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/
    //   );

    //   if (urlMatch) {
    //     setUrlId(urlMatch[0]);
    //   } else {
    //     alert("v=이 없을 경우 실행. urlMatch 값 : " + urlMatch);
    //     return;
    //   }
    // }

    // "youtu"을 포함한 경우
    if (videoUrl.includes("youtu")) {
      let urlMatch; // urlMatch를 조건문 밖에서 선언

      // www이 포함되어 있을때
      if (videoUrl.includes("www.")) {
        urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
      }

      // www이 없고 ?si=를 포함할 경우
      else if (videoUrl.includes("?si=")) {
        urlMatch = videoUrl.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
      }
      // https://youtu.be/로 시작할 때
      else {
        urlMatch = videoUrl.match(/(?<=https:\/\/youtu.be\/)[a-zA-Z0-9_-]+/);
      }

      if (urlMatch) {
        setUrlId(urlMatch[0]);
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
