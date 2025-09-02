import React, { useState } from "react";
import styles from "./style.module.css";

const NowPlay = () => {
  const [musics, setMusics] = useState<[]>([]);

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-right"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div className={styles["music-column-number"]}>#</div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-duration"]}>Duration</div>
            <div className={styles["music-column-action-menu"]}></div>
          </div>

          {/* 노래가 없을경우 */}
          {Array.isArray(musics) && musics.length === 0 ? (
            <div className={styles["music-item-undefined"]}>
              {"재생목록이 비어있습니다. 음악을 추가해주세요."}
            </div>
          ) : (
            <div className={styles["main-music-container"]}>
              {musics.map((music, index) => (
                <div
                  key={index}
                  className={styles["main-music-data-info-box"]}
                  style={{
                    cursor: "pointer",
                  }}
                  draggable
                >
                  <div className={styles["music-info-number"]}>{index + 1}</div>

                  <div className={styles["music-move-btn"]}></div>

                  <div className={styles["music-info-image-title-box"]}>
                    <div
                      className={styles["music-info-image"]}
                      style={
                        {
                          // backgroundImage: `url(${music.basicInfo.imageUrl})`,
                        }
                      }
                    ></div>

                    {/* 수정을 위해 title div를 input으로 바꿔주기 */}
                    <div
                      className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                    >
                      {/* {music.basicInfo.title} */}
                      title
                    </div>
                  </div>

                  {/* 수정을 위해 artist div를 input으로 바꿔주기 */}
                  <div className={styles["music-info-artist"]}>
                    {/* {music.basicInfo.author} */}
                    author
                  </div>
                  <div className={styles["music-info-createdAt"]}>
                    {/* {music.createdAt.split("T")[0]} */}
                    createAt
                  </div>
                  <div className={styles["music-info-duration"]}>
                    {/* {formatTime(music.duration)} */}
                    duration
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NowPlay;
