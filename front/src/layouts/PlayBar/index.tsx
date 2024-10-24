import React from "react";
import styles from "./style.module.css";

const PlayBar = () => {
  return (
    <div className={styles["main-wrap-bottom"]}>
      <div className={styles["main-wrap-bottom-left"]}></div>
      <div className={styles["main-wrap-bottom-center"]}>
        <div className={styles["main-play-box"]}>
          <div className={styles["main-play-top"]}>
            <div className={styles["main-play-prev-btn"]}></div>
            <div className={styles["main-play-btn"]}></div>
            <div className={styles["main-play-next-btn"]}></div>
          </div>
          <div className={styles["main-play-bottom"]}>
            <div className={styles["music-current-time"]}>00:00</div>
            <div className={styles["music-progress-bar-box"]}>
              <div className={styles["music-progress-fill"]}></div>
            </div>
            <div className={styles["music-full-time"]}>00:00</div>
          </div>
        </div>
      </div>

      <div className={styles["main-wrap-bottom-right"]}>
        <div className={styles["music-sound-bar-container"]}>
          <div className={styles["music-sound-bar"]}>
            <div className={styles["music-sound-bar-fill"]}></div>
          </div>
        </div>

        <div className={styles["music-sound-icon"]}></div>
      </div>
    </div>
  );
};

export default PlayBar;
