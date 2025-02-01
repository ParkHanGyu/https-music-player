import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  deleteMusic,
  getPlaylistMusicReqeust,
  playlistOrderReqeust,
} from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { useNavigate, useParams } from "react-router-dom";
import GetMusciResponseDto from "../../apis/response/Music/get-music.dto";
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

const PlayList = () => {
  const [cookies] = useCookies();
  const { playlistId } = useParams();

  //      Zustand state : playBar url, info, 로딩 상태      //
  const { playBarUrl, setPlayBarUrl, setPlayBarInfo, isLoading, setIsLoading } =
    useVideoStore();

  //      Zustand state : playBar 재생목록 상태      //
  const {
    nowPlayingPlaylist,
    setNowPlayingPlaylist,
    nowPlayingPlaylistID,
    setNowPlayingPlaylistID,
    setNowRandomPlaylist,
    setNowRandomPlaylistID,
  } = usePlaylistStore();
  const formatTime = useFormatTime();

  //      state :  playBar 재생 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      hook (커스텀) : 음악 정보 커스텀 hook   //
  const { infoData: copyInfoData, setMusicInfo: setCopyInfoData } =
    useMediaInfo("");

  //      hook (커스텀) : 음악 정보 커스텀 hook   //
  const { infoData, setMusicInfo } = useMediaInfo("");

  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();
  const navigator = useNavigate();

  //      useEffect :  재생목록 클릭 또는 로딩이 끝났을때 실행.             쿠키가 없을 경우 로그인 요청. 그게 아니라면 해당 재생목록 음악 받아오기       //
  useEffect(() => {
    if (!isLoading) {
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
  }, [playlistId, isLoading]);
  const getPlaylistMusicResponse = (
    responseBody: GetMusciResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetMusciResponseDto;
    setMusics(playListResult.musicList);
    // 삭제 이후 다시 api가 작동한 경우 nowPlayingPlaylist도 최신화 시켜줘야함.
    // if 조건이 없다면 듣는 노래가 nowPlayingPlaylist가 1인데 2를 누르면 nowPlayingPlaylist가 자동으로 1에서 2로 바뀐다. 즉 nowPlayingPlaylistID와 보고있는 재생목록 ID가 같으면 최신화해주는
    if (nowPlayingPlaylistID === playlistId) {
      setNowPlayingPlaylist(playListResult.musicList);
      setNowRandomPlaylist(playListResult.musicList);
    }
  };

  const [musics, setMusics] = useState<Music[]>([]);

  const testBtn = () => {
    alert("엑세스 토큰 : " + cookies.accessToken);
  };

  // onPlayMusic(), 음악 삭제 이후 음악 변경시 deleteMusicResponse()
  // + 1월 24일 삭제 기능에서 직접 콜백으로 정보를 set해줬음
  // useE!ffect(() => {
  //   if (infoData.vidUrl !== "-") {
  //     setPlayBarInfo(infoData);
  //   }
  // }, [infoData]);

  const onPlayMusic = (index: number) => {
    console.log("onPlayMusic 실행");
    console.log("이때 cookies.accessToken : ", cookies.accessToken);
    console.log("이때 loginUserInfo : ", loginUserInfo);
    if (!loginUserInfo) {
      console.log("playlist.tsx 96");
      alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
      navigator(MAIN_PATH());
      return;
    }

    const itemMusicUrl = musics[index].url;
    setMusicInfo(itemMusicUrl, (newInfoData) => {
      setPlayBarInfo(newInfoData);
    });

    // 다른 재생목록의 같은 노래일 경우 같은 노래를 틀어야 하니 빈문자열로 set
    if (itemMusicUrl === playBarUrl && nowPlayingPlaylistID !== playlistId) {
      setPlayBarUrl("");
    }

    //useEffect를 너무 많이 사용하면 복잡하기 때문에 setTimeout으로 대체
    // useEffect 또는 setTimeout을 사용하지 않으면 비동기상태이기 때문에 setPlayBarUrl("");을 해줄 이유가 없음
    setTimeout(() => {
      setPlayBarUrl(itemMusicUrl); // 이때 playBar.tsx에 있는 useEffect 실행
      setNowPlayingPlaylistID(playlistId);
      setNowPlayingPlaylist(musics);
      setNowRandomPlaylistID(playlistId);
      setNowRandomPlaylist(musics);
    }, 100); // 다시 설정
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const onMusicAction = (index: number) => {
    // 현재 선택된 인덱스가 열려있다면 닫고, 아니면 열기
    // 열어줄 index를 set해줌
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    setIsOpen(true); // 외부 클릭 시 닫히는 기능 추가
  };

  const onHandleMusicCopy = (index: number) => {
    setOpenDropdownIndex(null);
    setPlaylistPopupOpen(!playlistPopupOpen);
    const itemMusicUrl = musics[index].url;

    if (itemMusicUrl) {
      setMusicInfo(itemMusicUrl);
      setInfoDuration(musics[index].duration);
    }
  };

  const onHandleMusicDelete = (musicId: bigint) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (isConfirmed) {
      setOpenDropdownIndex(null);
      setIsLoading(true);
      deleteMusic(musicId, cookies.accessToken).then((responseBody) =>
        deleteMusicResponse(responseBody, musicId)
      );
    }
  };
  const deleteMusicResponse = (
    responseBody: ResponseDto | null,
    musicId: bigint
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    // ++

    setPlayBarUrl("");
    setIsPlaying(false);
    // setPlayBarDuration(0);

    // ++

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
      nowPlayingPlaylist.find((item) => item.musicId === musicId)?.url || null;

    // 삭제한 노래가 현재 듣고 있는 노래라면 다음 노래로 넘어가야 함.
    if (deleteMusicUrl === playBarUrl && playlistId === nowPlayingPlaylistID) {
      // 하지만 삭제하는 노래가 마지막 노래라면? 첫번쨰 노래로 넘어가야함.
      //                11 - 1          === 5
      if (lastIndexBoolean) {
        const newMusicUrl = nowPlayingPlaylist[0].url;
        setPlayBarUrl(newMusicUrl);
        setMusicInfo(newMusicUrl, (newInfoData) => {
          setPlayBarInfo(newInfoData);
        });
      }

      // 마지막 노래가 아니라면 다음 노래로 넘어가야함.
      if (!lastIndexBoolean) {
        const newMusicUrl = nowPlayingPlaylist[deleteMusicIndex + 1].url;
        setPlayBarUrl(newMusicUrl);
        // 콜백
        setMusicInfo(newMusicUrl, (newInfoData) => {
          setPlayBarInfo(newInfoData);
        });
      }
    }

    setIsLoading(false); // 이때 useEffect로 music을 최신화
  };

  // ++

  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  // ++

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [existingHoveredIndex, setExistingHoveredIndex] = useState<
    number | null
  >(null);
  const [targetMusicId, setTargetMusicId] = useState<bigint | null>(null);

  // 드래그 시작
  const handleDragStart = (index: number) => {
    console.log("드래그 시작");
    setDraggedIndex(index);
    setExistingHoveredIndex(index);
    setTargetMusicId(musics[index].musicId);
  };

  // 드래그 중
  const handleDragEnter = (index: number) => {
    console.log("드래그 중");

    setHoveredIndex(index);

    if (draggedIndex !== null && draggedIndex !== index) {
      const updatedPlaylist = [...musics];
      const [draggedItem] = updatedPlaylist.splice(draggedIndex, 1);
      updatedPlaylist.splice(index, 0, draggedItem);

      setMusics(updatedPlaylist);
      setDraggedIndex(index);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    console.log("드래그 종료");

    console.log("이동할 위치 Position : ", hoveredIndex);
    console.log("기존 Position 값 :", existingHoveredIndex);
    console.log("위치를 변경하고 싶은 노래의 testIndex 값 :", targetMusicId);

    // 변한게 없으면 retrun
    if (hoveredIndex === existingHoveredIndex) {
      console.log("기존 값과 같기 때문에 api 실행하지 않고 return");
      return;
    }

    const requestBody: updatePlaylistOrderRequestDto = {
      // 몇번쨰로 이동할지
      hoveredIndex: hoveredIndex,
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
    if (!ResponseUtil(responseBody)) {
      return;
    }
    setDraggedIndex(null);
    setHoveredIndex(null);

    // nowPlaylist 수정
    setNowPlayingPlaylist(musics);
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-right"]}>
            <div className={styles["main-music-data-column-box"]}>
              <div className={styles["music-column-number"]} onClick={testBtn}>
                #
              </div>
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
                    className={
                      nowPlayingPlaylistID === playlistId &&
                      playBarUrl &&
                      music.url.includes(playBarUrl)
                        ? `${styles["main-music-data-info-box"]} ${styles["music-target"]}`
                        : styles["main-music-data-info-box"]
                    }
                    style={{
                      cursor: playlistPopupOpen ? "" : "pointer",
                    }}
                    onClick={() => onPlayMusic(index)}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={() => handleDragEnd()}
                  >
                    <div className={styles["music-info-number"]}>
                      {index + 1}
                    </div>

                    <div className={styles["music-move-btn"]}></div>

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
                            onClick={(
                              event: React.MouseEvent<HTMLLIElement>
                            ) => {
                              event.stopPropagation();
                              onHandleMusicCopy(index); // 클릭된 음악의 인덱스를 전달
                            }}
                          >
                            음악복사
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
                infoData={infoData}
                infoDuration={infoDuration}
                playlistPopupOpen={playlistPopupOpen}
                setPlaylistPopupOpen={setPlaylistPopupOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;
