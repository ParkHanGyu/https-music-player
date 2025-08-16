import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import LikeRankMusic from "../../types/interface/like-rank-music.interface";
import { useCookies } from "react-cookie";
import { myMusicLikeRequest } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import myMusicLikeResponseDto from "../../apis/response/Music/get-my-music-like.dto";
import { ResponseUtil } from "../../utils";

const MyLike = () => {
  const [cookies] = useCookies();

  const dummyLikeRankMusic: LikeRankMusic[] = [
    {
      musicId: BigInt(1),
      title: "Shape of You",
      author: "Ed Sheeran",
      duration: 233,
      url: "https://example.com/music/shape-of-you.mp3",
      imageUrl: "https://example.com/images/shape-of-you.jpg",
      createdAt: "2025-08-16T12:00:00",
      likeCount: 152,
      liked: true,
    },
    {
      musicId: BigInt(2),
      title: "Blinding Lights",
      author: "The Weeknd",
      duration: 201,
      url: "https://example.com/music/blinding-lights.mp3",
      imageUrl: "https://example.com/images/blinding-lights.jpg",
      createdAt: "2025-08-15T15:30:00",
      likeCount: 98,
      liked: false,
    },
    {
      musicId: BigInt(3),
      title: "Levitating",
      author: "Dua Lipa",
      duration: 203,
      url: "https://example.com/music/levitating.mp3",
      imageUrl: "https://example.com/images/levitating.jpg",
      createdAt: "2025-08-14T10:20:00",
      likeCount: 120,
      liked: true,
    },
  ];
  const [myLikeMusic, setMyLikeMusic] =
    useState<LikeRankMusic[]>(dummyLikeRankMusic);

  // useEffect
  useEffect(() => {
    myMusicLikeRequest(cookies.accessToken).then(myMusicLikeResponse);
  }, []);

  const myMusicLikeResponse = (
    responseBody: myMusicLikeResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const musicLikeRankResult = responseBody as myMusicLikeResponseDto;
    console.log("59줄 : ", JSON.stringify(musicLikeRankResult, null, 2));

    setMyLikeMusic(musicLikeRankResult.musicList);
  };
  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-container"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div
              className={styles["music-column-all-play"]}
              // onClick={handlePlaySelected}
            ></div>

            <div className={styles["music-column-number"]}>Rank</div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-like"]}>Like</div>
            <div className={styles["music-column-play"]}>Play</div>
            <div className={styles["music-column-add"]}>Add</div>
            {/* <div className={styles["music-column-action-menu"]}></div> */}
          </div>

          <div className={styles["main-music-container"]}>
            {myLikeMusic.map((music, index) => (
              <div key={index} className={styles["main-music-data-info-box"]}>
                <div className={styles["music-info-play-check"]}>
                  <input
                    type="checkbox"
                    // checked={checkedMusicIds.includes(Number(music.musicId))}
                    // onChange={() => handleCheck(Number(music.musicId))}
                  />
                </div>

                {/* rank */}
                <div className={styles["music-info-number"]}>{index + 1}</div>
                {/* <div className={styles["music-info-rank-move"]}></div> */}
                {/* image + title */}
                <div
                  className={styles["music-info-image-title-box"]}
                  // onClick={() => handleMusicInfoClick(music.url)}
                >
                  <div
                    className={styles["music-info-image"]}
                    style={{
                      backgroundImage: `url(${music.imageUrl})`,
                    }}
                  ></div>
                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.title}
                  </div>
                </div>

                {/* author */}
                <div className={styles["music-info-artist"]}>
                  {music.author}
                </div>
                {/* At */}
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                {/* like */}
                <div className={styles["music-info-like"]}>
                  <div
                    className={`${styles["music-info-like-imge"]} ${
                      music.liked ? styles["like-true"] : undefined
                    }`}
                  ></div>
                  <div className={styles["music-info-like-count"]}>
                    {music.likeCount}
                  </div>
                </div>

                {/* play */}
                <div className={styles["music-info-play"]}>
                  <div
                    className={styles["music-info-play-imge"]}
                    // onClick={() => playHandleClick(music)}
                  ></div>
                </div>

                {/* 재생목록 추가 */}
                <div className={styles["music-info-add"]}>
                  <div
                    className={styles["music-info-add-imge"]}
                    // onClick={() => togglePlaylistPopup(music)}
                  ></div>
                </div>

                {/* ================= 더보기 btn ================ */}
                <div className={styles["music-info-action-btn"]}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* =======================================재생목록 팝업 */}
      {/* {playlistPopupOpen && (
        <PlaylistLibrary
          infoData={targetInfoData}
          infoDuration={infoDuration}
          playlistPopupOpen={playlistPopupOpen}
          setPlaylistPopupOpen={setPlaylistPopupOpen}
        />
      )} */}
    </>
  );
};

export default MyLike;
