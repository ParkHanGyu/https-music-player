import React, { useEffect } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { musicLikeRankRequest } from "../../apis";

const LikeRank = () => {
  //      Zustand state : playBar 재생목록 상태      //
  const { musics } = usePlaylistStore();

  useEffect(() => {
    // musicLikeRankRequest().then(musicLikeRankResponse);
    musicLikeRankRequest().then();
  }, []);

  // const getPlaylistMusicResponse = (
  //     responseBody: GetMusicResponseDto | ResponseDto | null
  //   ) => {
  //     if (!ResponseUtil(responseBody)) {
  //       return;
  //     }
  //     const playListResult = responseBody as GetMusicResponseDto;
  //     console.log(JSON.stringify(playListResult, null, 2));
  //     setMusics(playListResult.musicList);
  //   };

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-container"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div className={styles["music-column-number"]}>Rank</div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-like"]}>Like</div>
            <div className={styles["music-column-action-menu"]}></div>
          </div>

          <div className={styles["main-music-container"]}>
            {musics.map((music, index) => (
              <div key={index} className={styles["main-music-data-info-box"]}>
                <div className={styles["music-info-number"]}>{index + 1}</div>
                <div className={styles["music-info-rank-move"]}></div>

                <div className={styles["music-info-image-title-box"]}>
                  <div
                    className={styles["music-info-image"]}
                    style={{
                      backgroundImage: `url(${music.imageUrl})`,
                    }}
                  ></div>

                  {/* 수정을 위해 title div를 input으로 바꿔주기 */}
                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.title}
                  </div>
                </div>

                {/* 수정을 위해 artist div를 input으로 바꿔주기 */}
                <div className={styles["music-info-artist"]}>
                  {music.author}
                </div>
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                <div className={styles["music-info-like"]}>
                  <div className={styles["music-info-like-imge"]}></div>

                  {music.duration}
                </div>

                {/* ================= 더보기 btn ================ */}
                <div className={styles["music-info-action-btn"]}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LikeRank;
