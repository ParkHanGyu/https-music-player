import React, { useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { useVideoStore } from "../../store/useVideo.store";
import { Navigate, useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../constant";
import useLoginUserStore from "../../store/login-user.store";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";

const NowPlay = () => {
  //      Zustand state : playBar 재생목록 상태      //
  const {
    nowPlayingPlaylist,
    setNowPlayingPlaylist,
    nowPlayingPlaylistID,
    setNowPlayingPlaylistID,
    setNowRandomPlaylist,
    nowRandomPlaylist,
    setNowRandomPlaylistID,
    musics,
    setMusics,
  } = usePlaylistStore();

  //      Zustand state : playBar url, info, 로딩 상태      //
  const {
    playBarUrl,
    setPlayBarUrl,
    setPlayBarInfo,
    playlistLoading,
    setPlaylistLoading,
  } = useVideoStore();
  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();
  const navigator = useNavigate();

  const { setNowPlayViewState } = usePlaylistStore();

  const searchClickHandler = () => {
    setNowPlayViewState(false);
  };

  //      event handler : 음악 클릭 이벤트 처리 함수       //
  const onClickMusic = (index: number) => {
    // if (!loginUserInfo) {
    //   alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
    //   navigator(MAIN_PATH());
    //   return;
    // }
    // const itemMusicUrl = nowPlayingPlaylist[index].basicInfo.url;
    // const musicWithLike: MusicInfoAndLikeData = {
    //   musicInfo: nowPlayingPlaylist[index].basicInfo,
    //   like: nowPlayingPlaylist[index].like,
    // };
    // setPlayBarInfo(musicWithLike);
    // setTimeout(() => {
    //   setPlayBarUrl(itemMusicUrl); // 이때 playBar.tsx에 있는 useEffect 실행
    //   setNowPlayingPlaylistID(playlistId);
    //   setNowPlayingPlaylist(musics);
    //   // 랜덤 재생목록 set할때 내가 클릭한 노래가 제일 위로 위치하게
    //   const shufflePlaylist = shuffle(musics);
    //   // 옮길 배열
    //   const targetItem = shufflePlaylist.find(
    //     (item) => item.basicInfo.url === itemMusicUrl
    //   );
    //   // 이외 배열
    //   const filteredList = shufflePlaylist.filter(
    //     (item) => item.basicInfo.url !== itemMusicUrl
    //   );
    //   // 최종 결과 (targetItem을 맨 앞에 추가)
    //   const updatedNowRandomPlaylist = targetItem
    //     ? [targetItem, ...filteredList]
    //     : shufflePlaylist;
    //   setNowRandomPlaylistID(playlistId);
    //   setNowRandomPlaylist(updatedNowRandomPlaylist);
    // }, 100);
  };
  return (
    <>
      <div className={styles["main-wrap"]}>
        {Array.isArray(nowPlayingPlaylist) &&
        nowPlayingPlaylist.length === 0 ? (
          <div className={styles["music-item-undefined"]}>
            {"재생목록이 비어있습니다. 음악을 추가해주세요."}
          </div>
        ) : (
          <div className={styles["now-music-container"]}>
            <div className={styles["now-music-name"]}> Now Play</div>
            {nowPlayingPlaylist.map((nowPlayingPlaylist, index) => (
              <div
                className={
                  playBarUrl &&
                  nowPlayingPlaylist.basicInfo.url.includes(playBarUrl)
                    ? `${styles["now-music-item"]} ${styles["music-target"]}`
                    : styles["now-music-item"]
                }
                onClick={() => onClickMusic(index)}
              >
                <div
                  className={styles["now-music-image"]}
                  style={{
                    backgroundImage: `url(${nowPlayingPlaylist.basicInfo.imageUrl})`,
                  }}
                ></div>
                <div className={styles["now-music-info-box"]}>
                  <div className={styles["now-muisc-info-title"]}>
                    {nowPlayingPlaylist.basicInfo.title}
                  </div>
                  <div className={styles["now-muisc-info-author"]}>
                    {nowPlayingPlaylist.basicInfo.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles["now-music-bottom"]}>
          <div></div>
          <div
            className={styles["now-music-search-btn"]}
            onClick={searchClickHandler}
          ></div>
        </div>
      </div>
    </>
  );
};

export default NowPlay;
