import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import ReactPlayer from "react-player";

const PlayList = () => {
  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-right"]}>
            <div className={styles["main-music-data-column-box"]}>
              <div className={styles["music-column-number"]}>#</div>
              <div className={styles["music-column-title"]}>Title</div>
              <div className={styles["music-column-artist"]}>Artist</div>
              <div className={styles["music-column-album"]}>Album</div>
              <div className={styles["music-column-duration"]}>Duration</div>
            </div>

            <div className={styles["main-music-data-info-box"]}>
              <div className={styles["music-info-number"]}>1</div>

              <div className={styles["music-info-image-title-box"]}>
                <div className={styles["music-info-image"]}></div>

                <div
                  className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                >
                  제목1
                </div>
              </div>

              <div className={styles["music-info-artist"]}>아티스트1</div>
              <div className={styles["music-info-album"]}>앨범1</div>
              <div className={styles["music-info-duration"]}>3:33</div>
            </div>

            <div className={styles["main-music-data-info-box"]}>
              <div className={styles["music-info-number"]}>2</div>

              <div className={styles["music-info-image-title-box"]}>
                <div className={styles["music-info-image"]}></div>

                <div
                  className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                >
                  제목2
                </div>
              </div>

              <div className={styles["music-info-artist"]}>아티스트2</div>
              <div className={styles["music-info-album"]}>앨범2</div>
              <div className={styles["music-info-duration"]}>4:12</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;
