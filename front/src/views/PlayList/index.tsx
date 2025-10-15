import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  deleteMusic,
  getPlaylistMusicReqeust,
  playlistOrderReqeust,
} from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { useNavigate, useParams } from "react-router-dom";
import Music from "../../types/interface/music.interface";
import useFormatTime from "../../hooks/useFormatTime";
import { useVideoStore } from "../../store/useVideo.store";
import useOutsideClick from "../../hooks/useOutsideClick";
import useLoginUserStore from "../../store/login-user.store";
import { MAIN_PATH } from "../../constant";
import { useCookies } from "react-cookie";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import useMediaInfo from "../../hooks/useMediaInfo";
import { ResponseUtil } from "../../utils";
import updatePlaylistOrderRequestDto from "../../apis/request/update-playlist-order.dto";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import GetMusicResponseDto from "../../apis/response/Music/get-music.dto";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import AddMusicInfoData from "../../types/interface/music-info-data-test.interface";

const PlayList = () => {
  const [cookies] = useCookies();
  const { playlistId } = useParams();

  //      Zustand state : playBar url, info, 로딩 상태      //
  const {
    playBarUrl,
    setPlayBarUrl,
    setPlayBarInfo,
    playlistLoading,
    setPlaylistLoading,
    searchUrl,
    setSearchUrl,
  } = useVideoStore();

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
    nowPlayViewState,
    setNowPlayViewState,
    nowPlayIndex,
    setNowPlayIndex,
  } = usePlaylistStore();

  //    Zustand state : playBar.tsx 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  const formatTime = useFormatTime();

  //      state :  playBar 재생 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      hook (커스텀) : 음악 정보 커스텀 hook   //
  const { infoData, setMusicInfo } = useMediaInfo("");

  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();
  const navigator = useNavigate();

  //      useEffect :  재생목록 클릭 또는 로딩이 끝났을때 실행.             쿠키가 없을 경우 로그인 요청. 그게 아니라면 해당 재생목록 음악 받아오기       //
  useEffect(() => {
    if (!playlistLoading) {
      if (!cookies.accessToken) {
        alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
        navigator(MAIN_PATH());
        return;
      }
      if (playlistId) {
        getPlaylistMusicReqeust(playlistId, cookies.accessToken).then(
          getPlaylistMusicResponse
        );
      }
    }
  }, [playlistId, playlistLoading]);
  const getPlaylistMusicResponse = (
    responseBody: GetMusicResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetMusicResponseDto;
    console.log(JSON.stringify(playListResult, null, 2));
    setMusics(playListResult.musicList);
  };

  // const [musics, setMusics] = useState<Music[]>([]);

  //      event handler : 음악 셔플 이벤트 처리 함수       //
  const shuffle = (playlist: Music[]) => {
    const copiedPlaylist = [...playlist]; // 배열 복사
    return copiedPlaylist.sort(() => Math.random() - 0.5); // 셔플된 배열 반환
  };

  //      event handler : 음악 정보 영역 클릭 이벤트 함수       //
  const handleMusicInfoClick = (musicUrl: string) => {
    // window.open(musicUrl, "_blank");
    if (nowPlayViewState) {
      setNowPlayViewState(false);
    }
    setSearchUrl(musicUrl);
  };

  // const onPlayMusic = (index: number) => {
  //   console.log("이때 loginUserInfo : ", loginUserInfo);
  //   if (!loginUserInfo) {
  //     console.log("playlist.tsx 96");
  //     alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
  //     navigator(MAIN_PATH());
  //     return;
  //   }

  //   const itemMusicUrl = musics[index].basicInfo.url;
  //   const itemMusicLike = musics[index].like;
  //   setMusicInfo(itemMusicUrl, (newInfoData) => {
  //     const musicWithLike: MusicInfoAndLikeData = {
  //       musicInfo: newInfoData,
  //       like: itemMusicLike,
  //     };
  //     setPlayBarInfo(musicWithLike);
  //   });

  //   // 다른 재생목록의 같은 노래일 경우 같은 노래를 틀어야 하니 빈문자열로 set
  //   if (itemMusicUrl === playBarUrl && nowPlayingPlaylistID !== playlistId) {
  //     setPlayBarUrl("");
  //   }

  //   // useE!ffect를 너무 많이 사용하면 복잡하기 때문에 setTimeout으로 대체
  //   // useE!ffect 또는 setTimeout을 사용하지 않으면 비동기상태이기 때문에 setPlayBarUrl("");을 해줄 이유가 없음
  //   setTimeout(() => {
  //     setPlayBarUrl(itemMusicUrl); // 이때 playBar.tsx에 있는 useEffect 실행
  //     setNowPlayingPlaylistID(playlistId);
  //     setNowPlayingPlaylist(musics);

  //     // 랜덤 재생목록 set할때 내가 클릭한 노래가 제일 위로 위치하게
  //     const shufflePlaylist = shuffle(musics);
  //     // 옮길 배열
  //     const targetItem = shufflePlaylist.find(
  //       (item) => item.basicInfo.url === itemMusicUrl
  //     );
  //     // 이외 배열
  //     const filteredList = shufflePlaylist.filter(
  //       (item) => item.basicInfo.url !== itemMusicUrl
  //     );
  //     // 최종 결과 (targetItem을 맨 앞에 추가)
  //     const updatedNowRandomPlaylist = targetItem
  //       ? [targetItem, ...filteredList]
  //       : shufflePlaylist;

  //     setNowRandomPlaylistID(playlistId);
  //     setNowRandomPlaylist(updatedNowRandomPlaylist);

  //     if (!searchUrl) {
  //       setNowPlayViewState(true);
  //     }
  //   }, 100);
  // };

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const onMusicAction = (index: number) => {
    // 현재 선택된 인덱스가 열려있다면 닫고, 아니면 열기
    // 열어줄 index를 set해줌
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    setIsOpen(true); // 외부 클릭 시 닫히는 기능 추가
  };

  const [targetInfoData, setTargetInfoData] = useState<AddMusicInfoData[]>([
    {
      basicInfo: {
        url: "",
        author: "",
        imageUrl: "",
        title: "",
      },
      infoDuration: 0,
    },
  ]);

  // 음악 복사
  const onHandleMusicCopy = (index: number) => {
    const targetMusicInfo: AddMusicInfoData[] = [
      {
        basicInfo: musics[index].basicInfo,
        infoDuration: musics[index].duration,
      },
    ];

    setTargetInfoData(targetMusicInfo);
    // 더보기 창 닫기
    setOpenDropdownIndex(null);
    // 음악 추가 창 열기
    setPlaylistPopupOpen(!playlistPopupOpen);

    const itemMusicUrl = musics[index].basicInfo.url;

    if (itemMusicUrl) {
      setMusicInfo(itemMusicUrl);
      setInfoDuration(musics[index].duration);
    }
  };

  // now play에 추가
  const onHandleNowPlayAdd = (index: number) => {
    console.log("노래 정보 : " + JSON.stringify(musics[index], null, 2));
    const targetItemInfo: Music = musics[index];
    setNowPlayingPlaylist([...nowPlayingPlaylist, targetItemInfo]);
  };

  // 음악 삭제
  const onHandleMusicDelete = (musicId: bigint) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (isConfirmed) {
      setOpenDropdownIndex(null);

      console.log("로딩true");
      setPlaylistLoading(true);
      if (playlistId) {
        deleteMusic(playlistId, musicId, cookies.accessToken).then(
          (responseBody) => deleteMusicResponse(responseBody, musicId)
        );
      }
    }
  };
  const deleteMusicResponse = (
    responseBody: ResponseDto | null,
    musicId: bigint
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    // 삭제한 음악이 현재 듣는 음악과 재생목록, 같은 음악이면
    // 다음 노래로 이동. 하지만 마지막 노래라면 첫번째 노래로 이동

    // 이전 playlist에서 삭제하는 노래의 index값 (삭제 이후 다음 노래로 바꾸기 위해 구해둠)
    const deleteMusicIndex = nowPlayingPlaylist.findIndex(
      (item) => item.musicId === musicId
    );

    // 이전 nowPlayingPlaylist의 개수와 삭제하는 음악의 index + 1 과 같으면 true
    // 마지막 노래인지 true / false
    const lastIndexBoolean = nowPlayingPlaylist.length - 1 === deleteMusicIndex;

    // 삭제하는 음악의 url
    const deleteMusicUrl =
      nowPlayingPlaylist.find((item) => item.musicId === musicId)?.basicInfo
        .url || null;

    // 삭제한 노래가 현재 듣고 있는 노래라면 다음 노래로 넘어가야 함.
    if (deleteMusicUrl === playBarUrl && playlistId === nowPlayingPlaylistID) {
      // 하지만 삭제하는 노래가 마지막 노래라면? 첫번쨰 노래로 넘어가야함.
      //                11 - 1          === 5
      if (lastIndexBoolean) {
        const newMusicUrl = nowPlayingPlaylist[0].basicInfo.url;
        setPlayBarUrl(newMusicUrl);
        setMusicInfo(newMusicUrl, (newInfoData) => {
          const musicWithLike: MusicInfoAndLikeData = {
            musicInfo: newInfoData,
            like: nowPlayingPlaylist[0].like,
          };
          setPlayBarInfo(musicWithLike);
        });
      } else {
        const newMusicUrl =
          nowPlayingPlaylist[deleteMusicIndex + 1].basicInfo.url;
        setPlayBarUrl(newMusicUrl);
        // 콜백
        setMusicInfo(newMusicUrl, (newInfoData) => {
          const musicWithLike: MusicInfoAndLikeData = {
            musicInfo: newInfoData,
            like: nowPlayingPlaylist[deleteMusicIndex + 1].like,
          };
          setPlayBarInfo(musicWithLike);
        });
      }
    }

    console.log("로딩 false");
    setPlaylistLoading(false);
  };

  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  // 마우스 외부 클릭 이벤트 커스텀 hook
  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLUListElement>(false);

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdownIndex(null);
    }
  }, [isOpen]);
  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  // ========================================== 재생목록 순서 드래그
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null);
  const [targetMusicId, setTargetMusicId] = useState<bigint | null>(null);

  // 드래그 시작
  const handleDragStart = (index: number) => {
    setStartIndex(index);
    setHoveringIndex(index);
    setTargetMusicId(musics[index].musicId);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
    console.log("드래그 중");

    if (hoveringIndex !== null && hoveringIndex !== index) {
      const updatedPlaylist = [...musics];
      const [draggedItem] = updatedPlaylist.splice(hoveringIndex, 1);
      updatedPlaylist.splice(index, 0, draggedItem);

      setMusics(updatedPlaylist);
      setHoveringIndex(index);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    // 변한게 없으면 retrun
    console.log("드래그 종료");

    if (hoveringIndex === startIndex) {
      console.log("기존 값과 같기 때문에 api 실행하지 않고 return");
      return;
    }

    const requestBody: updatePlaylistOrderRequestDto = {
      // 몇번쨰로 이동할지
      hoveredIndex: hoveringIndex,
      // 이동할 음악 ID
      musicId: targetMusicId,
    };

    if (playlistId) {
      console.log(requestBody);
      playlistOrderReqeust(playlistId, requestBody, cookies.accessToken).then(
        playlistOrderResponse
      );
    }
  };
  const playlistOrderResponse = (responseBody: ResponseDto | null) => {
    console.log(JSON.stringify(responseBody, null, 2));
    if (!ResponseUtil(responseBody)) {
      return;
    }
    setStartIndex(null);
    setHoveringIndex(null);

    // if (playlistId === nowPlayingPlaylistID) {
    //   // nowPlaylist 수정
    //   setNowPlayingPlaylist(musics);
    // }
  };

  // ========================================== 재생목록 순서 드래그 끝

  const testBtn = () => {
    console.log("PlayList.tsx - musics : " + JSON.stringify(musics, null, 2));
  };

  //      state:  체크 상태 관리 상태        //
  const [checkedMusicIds, setCheckedMusicIds] = useState<number[]>([]);

  //      event handler:  체크박스 클릭 함수       //
  const handleCheck = (musicId: number) => {
    setCheckedMusicIds(
      (prev) =>
        prev.includes(musicId)
          ? prev.filter((id) => id !== musicId) // 이미 있으면 제거
          : [...prev, musicId] // 없으면 추가
    );
  };

  //      event handler:  전체 재생 버튼 클릭 함수       //
  const handlePlaySelected = () => {
    setNowPlayIndex(0);

    let targetMusic = musics;

    // 체크한게 있다면
    if (checkedMusicIds.length > 0) {
      targetMusic = musics.filter((music) =>
        checkedMusicIds.includes(Number(music.musicId))
      );
    }

    // Music[]타입에 맞게 set
    const selectedMusic: Music[] = targetMusic.map((music) => ({
      basicInfo: {
        url: music.basicInfo.url,
        title: music.basicInfo.title,
        imageUrl: music.basicInfo.imageUrl,
        author: music.basicInfo.author,
      },

      musicId: music.musicId,
      duration: music.duration,
      createdAt: music.createdAt,
      like: music.like,
    }));

    if (playBarUrl === selectedMusic[0].basicInfo.url) {
      setPlayBarUrl("");
    }

    // 첫번째 재생할 노래 info 데이터 준비
    const item1info: MusicInfoAndLikeData = {
      musicInfo: {
        url: selectedMusic[0].basicInfo.url,
        author: selectedMusic[0].basicInfo.author,
        imageUrl: selectedMusic[0].basicInfo.imageUrl,
        title: selectedMusic[0].basicInfo.title,
      },
      like: selectedMusic[0].like,
    };

    const targetItem = selectedMusic[0];
    const shuffleMusic = shuffle(selectedMusic);
    const newList = [
      targetItem,
      ...shuffleMusic.filter(m => m.basicInfo.url !== targetItem.basicInfo.url),
    ];

    setPlayBarInfo(item1info);
    setNowPlayingPlaylist(selectedMusic);
    setNowRandomPlaylist(newList);
    setNowRandomPlaylistID("");
    setNowPlayingPlaylistID("");
    setTimeout(() => {
      setPlayBarUrl(selectedMusic[0].basicInfo.url);
    }, 100);
    if (!isPlaying) {
      setIsPlaying(true);
    }
    setCheckedMusicIds([]);

    if (!nowPlayViewState) {
      setNowPlayViewState(true);
    }
  };

  // 로딩 중 표시
  if (playlistLoading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
      </div>
    );
  }
  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-right"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div
              className={styles["music-column-play-btn"]}
              onClick={handlePlaySelected}
            ></div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-duration"]}>Duration</div>
            <div className={styles["music-column-action-menu"]}></div>
          </div>

          {/* 노래가 없을경우 */}
          {Array.isArray(musics) && musics.length === 0 ? (
            <div
              className={styles["music-item-undefined"]}
              onClick={homeClickHandler}
            >
              {"재생목록이 비어있습니다. 음악을 추가해주세요."}
            </div>
          ) : (
            <div className={styles["main-music-container"]}>
              {musics.map((music, index) => (
                <div
                  key={index}
                  className={styles["main-music-data-info-box"]}
                  // style={{
                  //   cursor: playlistPopupOpen ? "" : "pointer",
                  // }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={() => handleDragEnd()}
                >
                  <div className={styles["music-info-play-check"]}>
                    <input
                      type="checkbox"
                      checked={checkedMusicIds.includes(Number(music.musicId))}
                      onChange={() => handleCheck(Number(music.musicId))}
                    />
                  </div>

                  <div className={styles["music-move-btn"]}></div>

                  <div
                    className={styles["music-info-image-title-box"]}
                    onClick={() => handleMusicInfoClick(music.basicInfo.url)}
                  >
                    {/* img */}
                    <div
                      className={styles["music-info-image"]}
                      style={{
                        backgroundImage: `url(${music.basicInfo.imageUrl})`,
                      }}
                    ></div>

                    {/* title */}
                    <div
                      className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                    >
                      {music.basicInfo.title}
                    </div>
                  </div>

                  {/* 작성자 */}
                  <div className={styles["music-info-artist"]}>
                    {music.basicInfo.author}
                  </div>
                  {/* 날짜 */}

                  <div className={styles["music-info-createdAt"]}>
                    {music.createdAt.split("T")[0]}
                  </div>
                  {/* 재생시간 */}

                  <div className={styles["music-info-duration"]}>
                    {formatTime(music.duration)}
                  </div>

                  {/* ================= 더보기 btn ================ */}
                  <div
                    className={styles["music-info-action-btn"]}
                    onClick={(
                      event: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      event.stopPropagation();
                      onMusicAction(index); // 클릭된 음악의 인덱스를 전달
                    }}
                    style={{
                      display:
                        openDropdownIndex === index && isOpen ? "block" : "",
                    }}
                  >
                    {/* 더보기 드롭다운 */}
                    {/* set해준 값과 index가 일치하면 보여줌  */}
                    {openDropdownIndex === index && isOpen && (
                      <ul ref={ref}>
                        <li
                          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                            event.stopPropagation();
                            onHandleMusicCopy(index); // 클릭된 음악의 인덱스를 전달
                          }}
                        >
                          음악복사
                        </li>
                        <li
                          onClick={() => {
                            // now play에 추가
                            onHandleNowPlayAdd(index); // 클릭된 음악의 인덱스를 전달
                          }}
                        >
                          Now Play Add
                        </li>
                        <li
                          onClick={() => {
                            // 삭제
                            onHandleMusicDelete(musics[index].musicId); // 클릭된 음악의 인덱스를 전달
                          }}
                        >
                          삭제
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {playlistPopupOpen && (
            <PlaylistLibrary
              infoData={targetInfoData}
              mode={"copy"}
              playlistPopupOpen={playlistPopupOpen}
              setPlaylistPopupOpen={setPlaylistPopupOpen}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PlayList;
