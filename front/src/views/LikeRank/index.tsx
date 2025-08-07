import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { musicLikeRankRequest } from "../../apis";
import musicLikeRankResponseDto from "../../apis/response/Music/get-music-like-rank.dto";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import LikeRankMusic from "../../types/interface/like-rank-music.interface";
import { useVideoStore } from "../../store/useVideo.store";

const LikeRank = () => {
  //      Zustand state : playBar 재생목록 상태      //
  const { musics } = usePlaylistStore();

  //    Zustand state : 메인 화면 검색 url 상태    //
  const { setSearchUrl } = useVideoStore();

  useEffect(() => {
    musicLikeRankRequest().then(musicLikeRankResponse);
  }, []);

  const [likeRankMusic, setLikeRankMusic] = useState<LikeRankMusic[]>([]);

  const musicLikeRankResponse = (
    responseBody: musicLikeRankResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const musicLikeRankResult = responseBody as musicLikeRankResponseDto;
    console.log("27줄 : ", JSON.stringify(musicLikeRankResult, null, 2));

    setLikeRankMusic(musicLikeRankResult.musicList);
  };

  //      event handler : 음악 정보 영역 클릭 이벤트 함수       //
  const handleMusicInfoClick = (musicUrl: string) => {
    // window.open(musicUrl, "_blank");
    setSearchUrl(musicUrl);
  };

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
            {likeRankMusic.map((music, index) => (
              <div key={index} className={styles["main-music-data-info-box"]}>
                <div className={styles["music-info-number"]}>{index + 1}</div>
                <div className={styles["music-info-rank-move"]}></div>

                <div
                  className={styles["music-info-image-title-box"]}
                  onClick={() => handleMusicInfoClick(music.url)}
                >
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

                  {music.likeCount}
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
