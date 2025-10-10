import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { useVideoStore } from "../../store/useVideo.store";
import { Navigate, useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../constant";
import useLoginUserStore from "../../store/login-user.store";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import Music from "../../types/interface/music.interface";
import PlaylistLibrary from "../PlaylistLibrary";
import TestInfoData from "../../types/interface/music-info-data-test.interface";
import AddMusicInfoData from "../../types/interface/music-info-data-test.interface";

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
    nowPlayIndex,
    setNowPlayIndex,
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

    setNowPlayIndex(index);
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

  //======== 삭제 관련
  const [deleteModeState, setDeleteModeState] = useState<boolean>(false);

  const handleDeleteMode = () => {
    setDeleteModeState(true);
  };

  //======== add 관련
  const [addModeState, setAddModeState] = useState<boolean>(false);

  const handleAddMode = () => {
    setAddModeState(true);
  };

  //======== 체크박스
  //      state:  체크 상태 관리 상태        //
  const [checkedMusicIds, setCheckedMusicIds] = useState<bigint[]>([]);

  //      event handler:  체크박스 클릭 함수       //
  const handleCheck = (musicId: bigint) => {
    setCheckedMusicIds(
      (prev) =>
        prev.includes(musicId)
          ? prev.filter((id) => id !== musicId) // 이미 있으면 제거
          : [...prev, musicId] // 없으면 추가
    );
  };

  // modeCancel
  const handleModeCancel = () => {
    if (addModeState) {
      setAddModeState(false);
    } else if (deleteModeState) {
      setDeleteModeState(false);
    }
  };

  const testBtn = () => {
    console.log("nowPlayIndex : " + nowPlayIndex);
  };

  // delete 기능
  const handleDelete = () => {
    // 체크한 노래 제외한 리스트 생성
    const filteredPlaylist = nowPlayingPlaylist.filter(
      (music) => !checkedMusicIds.includes(music.musicId)
    );

    // set
    setNowPlayingPlaylist(filteredPlaylist);

    // 체크한 노래(제외할) url 추출
    const checkedMusicUrls = nowPlayingPlaylist
      .filter((music) => checkedMusicIds.includes(music.musicId))
      .map((music) => music.basicInfo.url);

    // if 체크한 노래가 현재 듣는 노래라면?
    if (checkedMusicUrls.includes(playBarUrl)) {
      // 삭제할 음악중 마지막 url
      const deleteLastUrl = checkedMusicUrls[checkedMusicUrls.length - 1];

      // 마지막 url은 nowPlayingPlaylist에서 어느 순서에 있는지 확인
      const nextPlayIndex = nowPlayingPlaylist.findIndex(
        (music) => music.basicInfo.url === deleteLastUrl
      );

      // 해당 위치 다음 음악 url를 가져옴
      const nextPlayUrl = nowPlayingPlaylist[nextPlayIndex + 1]?.basicInfo.url;

      // 만약 st에 데이터가 없다면 => 마지막 index일경우 그럴수도 있음
      if (!nextPlayUrl) {
        // 위에서 음악 삭제후 리스트의 첫번쨰 url을 줌
        setPlayBarUrl(filteredPlaylist[0].basicInfo.url);
      } else {
        // 다음 음악 set
        setPlayBarUrl(nextPlayUrl);
      }
    }
  };

  // add기능
  const handleAdd = () => {
    // 체크한게 있다면
    if (checkedMusicIds.length) {
      // 체크한 노래 리스트 생성
      const refinedPlaylist = nowPlayingPlaylist
        .filter((music) => checkedMusicIds.includes(music.musicId))
        .map((music) => ({
          basicInfo: music.basicInfo,
          infoDuration: music.duration, // 이름 바꿔서 TestInfoData에 맞춤
        }));

      console.log(
        "추가하려는 노래 데이터 : " + JSON.stringify(refinedPlaylist, null, 2)
      );
      // const testInfo:TestInfoData = {
      //     basicInfo: nowPlayingPlaylist.;
      //     infoDuration: number;
      // }

      setInfoData(refinedPlaylist);
      setPlaylistPopupOpen(true);
    } else {
      // 체크한게 없다면
      alert("추가할 노래를 체크해주세요");
      return;
    }
  };

  // ====================================================== 재생목록 추가 관련
  //      state:  재생목록 팝업 상태 상태        //
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  const [infoData, setInfoData] = useState<AddMusicInfoData[]>([]);

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
            <div className={styles["now-music-top"]}>
              <div className={styles["now-music-name"]} onClick={testBtn}>
                Now Play
              </div>

              <div className={styles["now-music-action-btn"]}>
                {/* delete 모드일때 */}
                {deleteModeState && !addModeState ? (
                  <>
                    <div
                      className={styles["now-music-delete-btn"]}
                      onClick={handleDelete}
                    ></div>

                    <div
                      className={styles["now-music-mode-cancel-btn"]}
                      onClick={handleModeCancel}
                    ></div>
                  </>
                ) : // {/* add 모드일때 */}
                !deleteModeState && addModeState ? (
                  <>
                    <div
                      className={styles["now-music-add-btn"]}
                      onClick={handleAdd}
                    ></div>

                    <div
                      className={styles["now-music-mode-cancel-btn"]}
                      onClick={handleModeCancel}
                    ></div>
                  </>
                ) : (
                  <>
                    {/* 기본 모드 */}
                    <div
                      className={styles["now-music-add-btn"]}
                      onClick={handleAddMode}
                    ></div>
                    <div
                      className={styles["now-music-delete-btn"]}
                      onClick={handleDeleteMode}
                    ></div>
                  </>
                )}
              </div>
            </div>

            <div className={styles["now-music-item-mid"]}>
              {nowPlayingPlaylist.map((nowPlayingPlaylistItem, index) => (
                <div
                  className={
                    playBarUrl &&
                    nowPlayingPlaylistItem.basicInfo.url.includes(playBarUrl) &&
                    index === nowPlayIndex
                      ? `${styles["now-music-item"]} ${styles["music-target"]}`
                      : styles["now-music-item"]
                  }
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={() => handleDragEnd()}
                >
                  {(deleteModeState || addModeState) && (
                    <div className={styles["music-info-play-check"]}>
                      <input
                        type="checkbox"
                        checked={checkedMusicIds.includes(
                          nowPlayingPlaylistItem.musicId
                        )}
                        onChange={() =>
                          handleCheck(nowPlayingPlaylistItem.musicId)
                        }
                      />
                    </div>
                  )}

                  <div
                    className={styles["now-music-image"]}
                    onClick={() => onClickMusic(index)}
                    style={{
                      backgroundImage: `url(${nowPlayingPlaylistItem.basicInfo.imageUrl})`,
                    }}
                  ></div>
                  <div
                    className={styles["now-music-info-box"]}
                    onClick={() => onClickMusic(index)}
                  >
                    <div className={styles["now-muisc-info-title"]}>
                      {nowPlayingPlaylistItem.basicInfo.title}
                    </div>
                    <div className={styles["now-muisc-info-author"]}>
                      {nowPlayingPlaylistItem.basicInfo.author}
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

      {/* =======================================재생목록 팝업 */}
      {playlistPopupOpen && (
        <PlaylistLibrary
          // infoData={infoData}
          // infoDuration={infoDuration}
          mode={"copy"}
          infoData={infoData}
          playlistPopupOpen={playlistPopupOpen}
          setPlaylistPopupOpen={setPlaylistPopupOpen}
        />
      )}
    </>
  );
};

export default NowPlay;
