import React, { useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { useVideoStore } from "../../store/useVideo.store";
import { Navigate, useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../constant";
import useLoginUserStore from "../../store/login-user.store";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import Music from "../../types/interface/music.interface";

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
  //      event handler : 음악 셔플 이벤트 처리 함수       //
  const shuffle = (playlist: Music[]) => {
    const copiedPlaylist = [...playlist]; // 배열 복사
    return copiedPlaylist.sort(() => Math.random() - 0.5); // 셔플된 배열 반환
  };

  //      event handler : 음악 클릭 이벤트 처리 함수       //
  const onClickMusic = (index: number) => {
    if (!loginUserInfo) {
      alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
      navigator(MAIN_PATH());
      return;
    }
    // 클릭한 노래 url
    const itemMusicUrl = nowPlayingPlaylist[index].basicInfo.url;
    // 클릭한 노래 info data
    const musicWithLike: MusicInfoAndLikeData = {
      musicInfo: nowPlayingPlaylist[index].basicInfo,
      like: nowPlayingPlaylist[index].like,
    };
    // playBar info에 set
    setPlayBarInfo(musicWithLike);
    // playBar url에 set
    setPlayBarUrl(itemMusicUrl); // 이때 playBar.tsx에 있는 useEffect 실행

    // setNowPlayingPlaylistID(playlistId);
    // setNowPlayingPlaylist(musics);
    // 랜덤 재생목록 set할때 내가 클릭한 노래가 제일 위로 위치하게
    const shufflePlaylist = shuffle(nowPlayingPlaylist);
    // 옮길 배열
    const targetItem = shufflePlaylist.find(
      (item) => item.basicInfo.url === itemMusicUrl
    );
    // 이외 배열
    const filteredList = shufflePlaylist.filter(
      (item) => item.basicInfo.url !== itemMusicUrl
    );
    // 최종 결과 (targetItem을 맨 앞에 추가)
    const updatedNowRandomPlaylist = targetItem
      ? [targetItem, ...filteredList]
      : shufflePlaylist;
    // setNowRandomPlaylistID(playlistId);
    setNowRandomPlaylist(updatedNowRandomPlaylist);
  };

  // ========================================== 재생목록 순서 드래그
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null);

  // 드래그 시작
  const handleDragStart = (index: number) => {
    setHoveringIndex(index);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
    console.log("드래그 중");

    if (hoveringIndex !== null && hoveringIndex !== index) {
      const updatedPlaylist = [...nowPlayingPlaylist];
      const [draggedItem] = updatedPlaylist.splice(hoveringIndex, 1);
      updatedPlaylist.splice(index, 0, draggedItem);

      setNowPlayingPlaylist(updatedPlaylist);
      setHoveringIndex(index);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    // 변한게 없으면 retrun
    console.log("드래그 종료");

    setHoveringIndex(null);
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

            <div className={styles["now-music-item-container"]}>
              {nowPlayingPlaylist.map((nowPlayingPlaylist, index) => (
                <div
                  className={
                    playBarUrl &&
                    nowPlayingPlaylist.basicInfo.url.includes(playBarUrl)
                      ? `${styles["now-music-item"]} ${styles["music-target"]}`
                      : styles["now-music-item"]
                  }
                  onClick={() => onClickMusic(index)}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={() => handleDragEnd()}
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

                  <div className={styles["now-music-move-btn"]}></div>
                </div>
              ))}
            </div>
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
