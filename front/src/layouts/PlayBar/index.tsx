import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import Music from "../../types/interface/music.interface";
import useOutsideClick from "../../hooks/useOutsideClick";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import useMediaInfo from "../../hooks/useMediaInfo";
import usePlayerProgress from "../../hooks/usePlayerProgress";
import { useCookies } from "react-cookie";
import LoadingScreen from "../LoadingScreen";
import useLoginUserStore from "../../store/login-user.store";
import { musicLikeAddRequest, musicLikeRemoveRequest } from "../../apis";
import musicLikeRequestDto from "../../apis/request/music-like-request.dto";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { NOW_PLAY_PATH } from "../../constant";

const PlayBar = () => {
  const [cookies] = useCookies();
  const {
    playBarUrl,
    setPlayBarUrl,
    playBarInfo,
    setPlayBarInfo,
    // playBarDuration,
    // setPlayBarDuration,
  } = useVideoStore();
  const {
    nowPlayingPlaylist,
    nowRandomPlaylist,
    nowPlayingPlaylistID,
    setNowRandomPlaylist,
    setNowPlayingPlaylist,
    setNowPlayingPlaylistID,
    setNowRandomPlaylistID,
    musics,
    setMusics,
  } = usePlaylistStore();

  const { playlistId } = useParams();

  //    Zustand state : PlayBar 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();

  //      hook (커스텀) : musicInfo.tsx에서 set한 음악 정보     //
  const { infoData, setMusicInfo } = useMediaInfo("");

  const navigator = useNavigate();

  //      event handler: 재생, 일시정지 이벤트 처리 함수       //
  const handlePlayPause = () => {
    if (isLoading === false) {
      setIsPlaying(!isPlaying);
    }
  };
  // useEffect : 스페이스바로 일시정지, 재생
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     const activeTag = document.activeElement?.tagName;

  //     // 입력 중일 때는 무시
  //     if (
  //       activeTag === "INPUT" ||
  //       activeTag === "TEXTAREA" ||
  //       (document.activeElement as HTMLElement)?.isContentEditable
  //     ) {
  //       return;
  //     }

  //     if (event.code === "Space") {
  //       event.preventDefault(); // 기본 스크롤 방지
  //       if (isLoading === false) {
  //         console.log("스페이스바 실행");
  //         handlePlayPause();
  //         // setIsPlaying(!isPlaying);
  //       }
  //     }
  //   };

  //   document.addEventListener("keydown", handlePlayPause);
  //   return () => document.removeEventListener("keydown", handlePlayPause);
  // }, []);

  //================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // 스크롤 방지

        // Zustand 스토어의 현재 상태(snapshot)
        const { isPlaying, setIsPlaying } = usePlayerOptionStore.getState();
        if (!isPlaying) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const formatTime = useFormatTime();

  //      state:  playBar 동영상 시간 상태        //
  const [playBarDuration, setPlayBarDuration] = useState<number>(0);

  // 동영상 ref
  const playerRef = useRef<ReactPlayer | null>(null);

  //      event handler : playBar 동영상 시간 set 이벤트 처리 함수       //
  const handleDuration = (playBarDuration: number) => {
    console.log("동영상 길이 가져오는 옵션 실행");
    setPlayBarDuration(playBarDuration);
  };
  // ================================= animationFrame 관련해서 알아보기
  const { currentTime, played, setPlayed } = usePlayerProgress(
    playerRef,
    isPlaying
  );

  useEffect(() => {
    // console.log("played : " + played);
  }, [played]);

  // ======================================= 영상 진행도 수동 조절
  // 사용자에 의한 진행도 수동 이동
  const handleSeek = (newPlayed: number) => {
    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // 좌클릭(왼쪽 버튼)만 처리
    if (event.button !== 0) return;

    // 이벤트가 발생한 DOM 요소를 참조
    const progressBar = event.currentTarget;
    // 진행 바의 크기와 위치 정보를 담고 있는 DOMRect 객체를 저장
    const rect = progressBar.getBoundingClientRect();
    // 마우스 클릭 위치와 진행 바의 왼쪽 경계 간의 차이를 계산
    const offsetX = event.clientX - rect.left;

    // 진행 바에서 클릭한 위치를 비율로 나타냄
    const newPlayed = offsetX / rect.width;
    handleSeek(newPlayed);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const offsetX = moveEvent.clientX - rect.left;
      const newPlayed = Math.max(0, Math.min(1, offsetX / rect.width));

      // window.requestAnimationFrame(() => handleSeek(newPlayed));
      // or
      // handleSeek(newPlayed);
      setPlayed(newPlayed);
      playerRef.current?.seekTo(newPlayed);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ============================================= 영상 볼륨 진행도 조절
  //      state :  사운드바 드롭 상태        //
  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLDivElement>(false);

  //      state :  볼륨 상태        //
  const [volume, setVolume] = useState<number>(1); // 초기 볼륨을 최대값으로 설정

  //      event handler : 스피커 아이콘 클릭 이벤트 함수       //
  const onSoundDropDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleMouseDownVolume = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.button !== 0) return; // 좌클릭만 처리
    // 이벤트가 발생한 DOM 요소를 참조
    const volumeBar = event.currentTarget;
    // 진행 바의 크기와 위치 정보를 담고 있는 DOMRect 객체를 저장
    const rect = volumeBar.getBoundingClientRect();

    // 마우스 클릭 위치와 진행 바의 하단 경계 간의 차이를 계산
    const offsetY = rect.bottom - event.clientY;
    // 진행 바에서 클릭한 위치를 비율로 나타냄
    const newVolume = offsetY / rect.height;

    handleVolumeChange(newVolume); // 볼륨 업데이트

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const offsetY = rect.bottom - moveEvent.clientY;
      const newPlayed = Math.max(0, Math.min(1, offsetY / rect.height));
      handleVolumeChange(newPlayed); // 볼륨 업데이트
    };

    // mousemove와 mouseup 이벤트 리스너를 제거
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    //마우스가 움직일 때 handleMouseMove 함수 호출 (mousemove 이벤트)
    window.addEventListener("mousemove", handleMouseMove);
    //마우스를 놓았을 때 handleMouseUp 함수 호출 (mouseup 이벤트)
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ============================================== ReactPlayer 옵션 관련
  const handleReady = () => {
    console.log("handleReady 실행");
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 800);

    // if (playBarUrl !== "") {
    //   // true로 해준 뒤 ReactPlayer컴포넌트에서 준비 완료시 setIsLoading(false)를 해줌
    //   console.log("setIsLoading(true)실행");
    //   setIsLoading(true);
    // }

    // setTimeout(() => {
    //   setIsPlaying(true);
    // }, 800);
  };

  // ===================================================== 반복재생 관련
  //      state :  반복재생 상태        //
  const [isLoop, setIsLoop] = useState<boolean>(false);

  const onLoopchange = () => {
    setIsLoop(!isLoop);
  };

  // ====================================================== 랜덤재생 관련
  //      state :  랜덤재생 상태        //
  const [isRandom, setIsRandom] = useState<boolean>(false);

  //      event handler : 반복재생 클릭 이벤트 처리 함수       //
  const onRandomchange = () => {
    setIsRandom(!isRandom);
  };

  // ============ 영상 끝나면 실행되는 함수
  const handleEnded = () => {
    // 반복재생일경우
    if (playerRef.current && isLoop) {
      console.log("if 실행");
      playerRef.current.seekTo(0);
      setIsPlaying(false);
      setTimeout(() => {
        setIsPlaying(true);
      }, 200);
    } else if (nowPlayingPlaylist.length > 1 && !isLoop) {
      console.log("else if 실행");
      // 다음 재생할 노래가 있고 반복재생이 아닐경우
      onNextMusic();
    } else {
      // 노래가 한곡이고 반복재생이 아닐경우
      console.log("else 실행");
      setIsPlaying(false);
    }
  };

  // ===================================================== 일반적인 재생 관련
  //      event handler : 음악 셔플 이벤트 처리 함수       //
  const shuffle = (playlist: Music[]) => {
    const copiedPlaylist = [...playlist]; // 배열 복사
    return copiedPlaylist.sort(() => Math.random() - 0.5); // 셔플된 배열 반환
  };
  // ============== < 이전 음악
  const onPrevMusic = () => {
    if (Array.isArray(nowPlayingPlaylist) && nowPlayingPlaylist.length === 0) {
      alert("노래가 없음");
      return;
    }
    let prevMusicUrl;
    let prevMusicLike: boolean;

    if (isRandom) {
      // nowRandomPlaylist에서 현재 음악 index값
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.basicInfo.url.includes(playBarUrl)
      );
      // 근데 첫번째 노래라면
      if (!nowRandomPlaylist[nowIndex - 1]) {
        const lastIndex = nowRandomPlaylist.length - 1;

        prevMusicUrl = nowRandomPlaylist[lastIndex].basicInfo.url;
        prevMusicLike = nowRandomPlaylist[lastIndex].like;
      } else {
        // 그게 아니고 노래가 더 있다면
        prevMusicUrl = nowRandomPlaylist[nowIndex - 1].basicInfo.url;
        prevMusicLike = nowRandomPlaylist[nowIndex - 1].like;
      }

      console.log("랜덤재생 nowIndex : " + nowIndex);
    }

    // // 랜덤
    // if (isRandom) {
    //   // nowRandomPlaylist에서 현재 음악 index
    //   const nowIndex = nowRandomPlaylist.findIndex((music) =>
    //     music.basicInfo.url.includes(playBarUrl)
    //   );

    //   if (nowRandomPlaylist[nowIndex - 1]) {
    //     // nowIndex - 1 값이 있다면 이전노래의 index로
    //     prevMusicUrl = nowRandomPlaylist[nowIndex - 1].basicInfo.url;
    //     prevMusicLike = nowRandomPlaylist[nowIndex - 1].like;
    //     setNowPlayIndex(nowIndex - 1);
    //   } else if (!nowRandomPlaylist[nowIndex - 1]) {
    //     // nowIndex - 1 값이 없다면 마지막으로
    //     const randomPlaylistLength = nowRandomPlaylist.length;

    //     prevMusicUrl =
    //       nowRandomPlaylist[randomPlaylistLength - 1].basicInfo.url;
    //     prevMusicLike = nowRandomPlaylist[randomPlaylistLength - 1].like;
    //     setNowPlayIndex(randomPlaylistLength - 1);
    //   }
    // }

    // 일반
    if (!isRandom) {
      // nowPlayingPlaylist에서 현재 음악 index값
      const nowIndex = nowPlayingPlaylist.findIndex((music) =>
        music.basicInfo.url.includes(playBarUrl)
      );

      // 지금 노래가 첫번째 노래라면
      if (nowIndex === 0) {
        const prevIndex = nowPlayingPlaylist.length - 1;
        prevMusicUrl = nowPlayingPlaylist[prevIndex].basicInfo.url;
        prevMusicLike = nowPlayingPlaylist[prevIndex].like;
      } else {
        prevMusicUrl = nowPlayingPlaylist[nowIndex - 1].basicInfo.url;
        prevMusicLike = nowPlayingPlaylist[nowIndex - 1].like;
      }
    }

    if (prevMusicUrl) {
      // 콜백 함수 실행
      setMusicInfo(prevMusicUrl, (data) => {
        const musicWithLike: MusicInfoAndLikeData = {
          musicInfo: data,
          like: prevMusicLike,
        };
        setPlayBarInfo(musicWithLike);
      });
      setPlayBarUrl(prevMusicUrl);
    } else {
      return;
    }
  };

  // ============== 다음 음악 >
  const onNextMusic = () => {
    if (Array.isArray(nowPlayingPlaylist) && nowPlayingPlaylist.length === 0) {
      alert("노래가 없음");
      return;
    }
    let prevMusicUrl; // urlMatch를 조건문 밖에서 선언
    let prevMusicLike: boolean;

    // 랜덤
    if (isRandom) {
      // nowRandomPlaylist에서 현재 음악 index값
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.basicInfo.url.includes(playBarUrl)
      );
      // 근데 마지막 노래라면
      if (!nowRandomPlaylist[nowIndex + 1]) {
        // const filteredPlaylist = nowPlayingPlaylist.filter(
        //   (_, index) => index !== nowIndex
        // );

        // 기존 플레이리스트를 섞어서 새로운 배열에 복사(초기화)
        const resetRandomPlaylist = shuffle(nowPlayingPlaylist);

        // 기존 배열에 지금 재생중인 노래 정보 저장
        const targetItem = nowRandomPlaylist[nowIndex];

        // 초기화한 배열에 현재 듣는 노래를 삭제하고 맨 마지막 순서에 배치
        const newList = [
          ...resetRandomPlaylist.filter((_, index) => index !== nowIndex),
          targetItem,
        ];

        prevMusicUrl = newList[0].basicInfo.url;
        prevMusicLike = newList[0].like;

        setNowRandomPlaylist(newList);
      } else {
        // 그게 아니고 노래가 더 있다면
        prevMusicUrl = nowRandomPlaylist[nowIndex + 1].basicInfo.url;
        prevMusicLike = nowRandomPlaylist[nowIndex + 1].like;
      }

      // setNowPlayIndex(nowIndex + 1);
      console.log("랜덤재생 nowIndex : " + nowIndex);
    }

    // 일반
    if (!isRandom) {
      const nowIndex = nowPlayingPlaylist.findIndex((music) =>
        music.basicInfo.url.includes(playBarUrl)
      );
      // playlist의 총 노래개수와 현재 노래의 index값+1이 같다면 = playlist의 마지막 노래라면

      console.log("nowPlayingPlaylist.length: ", nowPlayingPlaylist.length);
      console.log("nowIndex + 1: ", nowIndex + 1);

      if (nowPlayingPlaylist.length === nowIndex + 1) {
        prevMusicUrl = nowPlayingPlaylist[0].basicInfo.url;
        prevMusicLike = nowPlayingPlaylist[0].like;
        console.log("마지막 노래라면 재생시킬 노래: ", prevMusicUrl);
        // setNowPlayIndex(0);
      } else {
        prevMusicUrl = nowPlayingPlaylist[nowIndex + 1].basicInfo.url;
        prevMusicLike = nowPlayingPlaylist[nowIndex + 1].like;
        console.log("마지막 노래가 아니라면 재생시킬 노래: ", prevMusicUrl);
        // setNowPlayIndex(nowIndex + 1);
      }

      console.log("일반재생 nowIndex : " + nowIndex);
    }

    if (prevMusicUrl) {
      // 콜백 함수 실행
      setMusicInfo(prevMusicUrl, (data) => {
        const musicWithLike: MusicInfoAndLikeData = {
          musicInfo: data,
          like: prevMusicLike,
        };
        setPlayBarInfo(musicWithLike);
      });
      setPlayBarUrl(prevMusicUrl);
    } else {
      return;
    }
  };

  //      event handler : 음악 정보 영역 클릭 이벤트 함수       //
  const handleMusicInfoClick = () => {
    // if (playBarInfo && playBarInfo.musicInfo.url) {
    //   window.open(playBarInfo.musicInfo.url, "_blank");
    // }

    navigator(NOW_PLAY_PATH());
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //  useEffect : playBarUrl 변경시 playBar에 노래 정보들이 set 될때까지 로딩 //
  // playBar변경시 버퍼링 대신 useEffect로 setIsLoading(true)로 로딩창 보여줌.
  // 이후 동영상 컴포넌트에서 handleReady() 함수로 setIsLoading(false)를 해줄꺼임.
  useEffect(() => {
    if (playBarUrl !== "") {
      // true로 해준 뒤 ReactPlayer컴포넌트에서 준비 완료시 setIsLoading(false)를 해줌
      console.log("setIsLoading(true)실행");
      console.log("setIsLoading(true)실행");
      setIsLoading(true);
    }

    // 노래를 듣는중에 로그인이 만료될 경우 현재 듣는 노래를 제외한 노래 순서를 초기화.
    // 로그인 하지 않으면 다음 노래부터 못들음
    if (!cookies.accessToken || !loginUserInfo) {
      setNowRandomPlaylist([]);
      setNowPlayingPlaylist([]);
      setNowPlayingPlaylistID("");
      setNowRandomPlaylistID("");
      return;
    }
  }, [playBarUrl]);

  const testBtn = () => {
    // console.log("nowPlayIndex상태 : ", JSON.stringify(nowPlayIndex, null, 2));
    console.log(
      "nowRandomPlaylist 상태 : ",
      JSON.stringify(nowRandomPlaylist, null, 2)
    );
  };

  const handleMusicLikeClick = () => {
    console.log(JSON.stringify(nowPlayingPlaylist, null, 2));
    console.log(JSON.stringify(playBarInfo, null, 2));
    console.log("loginUserInfo : ", JSON.stringify(loginUserInfo, null, 2));

    if (!loginUserInfo) {
      console.log("로그인 해주세요");
      return;
    }

    if (!playBarInfo) {
      return;
    }

    const requestBody: musicLikeRequestDto = {
      musicInfoData: playBarInfo.musicInfo,
      infoDuration: playBarDuration,
    };

    if (!playBarInfo?.like) {
      console.log("like add 실행");
      console.log(
        "서버에 보내는 데이터 requestBody : ",
        JSON.stringify(requestBody, null, 2)
      );

      musicLikeAddRequest(requestBody, cookies.accessToken).then(
        musicLikeAddResponse
      );

      // remove
    } else if (playBarInfo?.like !== undefined && playBarInfo?.like) {
      console.log("remove 실행");
      musicLikeRemoveRequest(playBarUrl, cookies.accessToken).then(
        musicLikeRemoveResponse
      );
    }
    if (playBarInfo) {
      playBarInfo.like = !playBarInfo.like;
    }
  };

  const musicLikeAddResponse = (
    responseBody: musicLikeRequestDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    console.log("musicLikeAddResponse 실행");
    if (nowPlayingPlaylist && nowPlayingPlaylistID === playlistId) {
      const updatedMusics = musics.map((music) =>
        music.basicInfo.url === playBarInfo?.musicInfo.url
          ? { ...music, like: true }
          : music
      );

      const updatedNowRandomMusics = nowRandomPlaylist.map((music) =>
        music.basicInfo.url === playBarInfo?.musicInfo.url
          ? { ...music, like: true }
          : music
      );

      setMusics(updatedMusics);
      setNowPlayingPlaylist(updatedMusics);
      setNowRandomPlaylist(updatedNowRandomMusics);
    }
  };

  const musicLikeRemoveResponse = (
    responseBody: musicLikeRequestDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    if (nowPlayingPlaylist && nowPlayingPlaylistID === playlistId) {
      const updatedMusics = musics.map((music) =>
        music.basicInfo.url === playBarInfo?.musicInfo.url
          ? { ...music, like: false }
          : music
      );

      const updatedNowRandomMusics = nowRandomPlaylist.map((music) =>
        music.basicInfo.url === playBarInfo?.musicInfo.url
          ? { ...music, like: false }
          : music
      );

      setMusics(updatedMusics);
      setNowPlayingPlaylist(updatedMusics);
      setNowRandomPlaylist(updatedNowRandomMusics);
    }
  };

  const handleError = () => {
    alert(
      "동영상 소유자가 외부 재생을 제한했습니다. 확인 후 다시 시도해주세요."
    );

    setIsPlaying(false);
    onNextMusic();
  };

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && <LoadingScreen loadingType="playBar" />}
      <div
        className={`${styles["main-wrap-bottom"]} ${
          isLoading ? styles["blur"] : undefined
        }`}
      >
        <div className={styles["main-wrap-bottom-left"]}>
          {playBarInfo && (
            <>
              {/* 검색한 노래라면 like 버튼 x */}
              <div
                className={`${styles["main-wrap-bottom-like"]} ${
                  playBarInfo.like ? styles["like-true"] : undefined
                }`}
                onClick={handleMusicLikeClick}
              ></div>

              <div
                className={styles["main-wrap-bottom-info"]}
                onClick={handleMusicInfoClick}
                style={{
                  cursor: playBarInfo ? "pointer" : "",
                }}
              >
                <div className={styles["main-wrap-play-img-box"]}>
                  <div
                    className={styles["main-wrap-play-img"]}
                    style={{
                      backgroundImage: `url(${playBarInfo?.musicInfo.imageUrl})`,
                    }}
                  ></div>
                </div>
                <div className={styles["main-wrap-play-info-box"]}>
                  <div className={styles["main-wrap-play-title"]}>
                    {playBarInfo?.musicInfo.title}
                  </div>
                  <div className={styles["main-wrap-play-artist"]}>
                    {playBarInfo?.musicInfo.author}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles["main-wrap-bottom-center"]}>
          <div className={styles["main-play-box"]}>
            <div className={styles["main-play-top"]}>
              <div className={styles["main-play-top-left"]}>
                {/* 반복재생 버튼 */}
                <div
                  className={`${styles["main-play-loop-btn"]} ${
                    isLoop ? styles["loop-active"] : undefined
                  }`}
                  onClick={onLoopchange}
                ></div>
              </div>

              <div className={styles["main-play-top-mid"]}>
                {/* 이전노래 */}
                <div
                  className={styles["main-play-prev-btn"]}
                  onClick={onPrevMusic}
                ></div>
                {/* 재생, 일시정지 버튼 */}
                <div
                  className={
                    isPlaying
                      ? styles["main-pause-btn"]
                      : styles["main-play-btn"]
                  }
                  onClick={handlePlayPause}
                ></div>
                {/* 다음노래 */}
                <div
                  className={styles["main-play-next-btn"]}
                  onClick={onNextMusic}
                ></div>
              </div>

              <div className={styles["main-play-top-right"]}>
                {/* 랜덤재생 버튼 */}
                <div
                  className={`${styles["main-play-random-btn"]} ${
                    isRandom ? styles["random-active"] : undefined
                  }`}
                  onClick={onRandomchange}
                ></div>
              </div>
            </div>

            <div className={styles["main-play-bottom"]}>
              <div className={styles["music-current-time"]}>
                {formatTime(currentTime)}
              </div>
              <div
                className={styles["music-progress-bar-box"]}
                onMouseDown={handleMouseDown}
              >
                <div
                  className={styles["music-progress-fill"]}
                  style={{
                    width: `${played * 100}%`,
                  }}
                ></div>

                <ReactPlayer
                  ref={playerRef}
                  url={playBarUrl}
                  playing={isPlaying}
                  onReady={handleReady}
                  onDuration={handleDuration}
                  onEnded={handleEnded}
                  onError={handleError}
                  volume={volume}
                  style={{ display: "none" }}
                />
              </div>
              <div className={styles["music-full-time"]}>
                {formatTime(playBarDuration)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles["main-wrap-bottom-right"]}>
          {isOpen && (
            <div className={styles["music-sound-bar-container"]} ref={ref}>
              <div
                className={styles["music-sound-bar"]}
                onMouseDown={handleMouseDownVolume}
              >
                <div
                  className={styles["music-sound-bar-fill"]}
                  style={{
                    height: `${volume * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div
            className={styles["music-sound-icon"]}
            // onClick={onSoundDropDown}
            onClick={testBtn}
          ></div>
        </div>
      </div>
    </>
  );
};

export default PlayBar;
