import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import Music from "../../types/interface/music.interface";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useParams } from "react-router-dom";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import useMediaInfo from "../../hooks/useMediaInfo";
import usePlayerProgress from "../../hooks/usePlayerProgress";
import { useCookies } from "react-cookie";
import LoadingScreen from "../LoadingScreen";
import useLoginUserStore from "../../store/login-user.store";

const PlayBar = () => {
  const [cookies] = useCookies();
  const { playBarUrl, setPlayBarUrl, playBarInfo, setPlayBarInfo } =
    useVideoStore();
  const {
    nowPlayingPlaylist,
    nowRandomPlaylist,
    setNowRandomPlaylist,
    setNowPlayingPlaylist,
    setNowPlayingPlaylistID,
    setNowRandomPlaylistID,
  } = usePlaylistStore();

  //    Zustand state : PlayBar 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();

  //      hook (커스텀) : musicInfo.tsx에서 set한 음악 정보     //
  const { infoData, setMusicInfo } = useMediaInfo("");

  //      event handler: 재생, 일시정지 이벤트 처리 함수       //
  const handlePlayPause = () => {
    if (isLoading === false) {
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = useFormatTime();

  //      state:  playBar 동영상 시간 상태        //
  const [playBarDuration, setPlayBarDuration] = useState<number>(0);

  // 동영상 ref
  const playerRef = useRef<ReactPlayer | null>(null);

  //      event handler : playBar 동영상 시간 set 이벤트 처리 함수       //
  const handleDuration = (playBarDuration: number) => {
    setPlayBarDuration(playBarDuration);
  };

  // ======================================= 영상 진행도 조절
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
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 800);
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
    if (playerRef.current && isLoop) {
      // url이 soundcloud면 url 다시 넣어줌
      if (playBarUrl.includes("soundcloud")) {
        setPlayBarUrl(""); // URL을 초기화
        setTimeout(() => setPlayBarUrl(playBarUrl), 10); // 다시 URL 설정
      } else {
        // soundcloud가 아닐경우 (유튜브일경우) 동영상 진행도 0으로
        playerRef.current.seekTo(0);
      }
    } else if (!isLoop) {
      onNextMusic();
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

    if (isRandom) {
      // nowRandomPlaylist에서 현재 음악 index
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );

      if (nowRandomPlaylist[nowIndex - 1]) {
        // nowIndex - 1 값이 있다면 이전노래의 index로
        prevMusicUrl = nowRandomPlaylist[nowIndex - 1].url;
      } else if (!nowRandomPlaylist[nowIndex - 1]) {
        // nowIndex - 1 값이 없다면 마지막으로

        const randomPlaylistLength = nowRandomPlaylist.length;

        prevMusicUrl = nowRandomPlaylist[randomPlaylistLength - 1].url;
      }
    }

    if (!isRandom) {
      // nowPlayingPlaylist에서 현재 음악 index값
      const nowIndex = nowPlayingPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );

      // 지금 노래가 첫번째 노래라면
      if (nowIndex === 0) {
        const prevIndex = nowPlayingPlaylist.length - 1;
        prevMusicUrl = nowPlayingPlaylist[prevIndex].url;
      } else {
        prevMusicUrl = nowPlayingPlaylist[nowIndex - 1].url;
      }
    }

    if (prevMusicUrl) {
      // 콜백 함수 실행
      setMusicInfo(prevMusicUrl, (data) => {
        setPlayBarInfo(data);
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

    if (isRandom) {
      console.log("onNextMusic() -> isRandom true if문 실행");
      console.log("nowRandomPlaylist.length : ", nowRandomPlaylist.length);
      // nowRandomPlaylist에서 현재 음악 index값
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );

      console.log("현재 노래의 index값 nowIndex : ", nowIndex);

      // 2월9일 추가중 .
      // .filter()로 삭제할 필요가 없으러 같음. 다음날 이걸로 로직 바꿔보기
      if (nowRandomPlaylist[nowIndex + 1]) {
        // nowIndex+1 값이 있다면 다음노래의 index로
        prevMusicUrl = nowRandomPlaylist[nowIndex + 1].url;
      } else if (!nowRandomPlaylist[nowIndex + 1]) {
        // nowIndex+1 값이 없다면 처음으로

        const resetRandomPlaylist = shuffle(nowPlayingPlaylist);
        // 옮길 배열
        const targetItem = resetRandomPlaylist.find(
          (item) => item.url === playBarUrl
        );

        // 이외 배열
        const filteredList = resetRandomPlaylist.filter(
          (item) => item.url !== playBarUrl
        );

        // 최종 결과 (targetItem을 맨 앞에 추가)
        const updatedNowRandomPlaylist = targetItem
          ? [...filteredList, targetItem]
          : nowRandomPlaylist;

        prevMusicUrl = updatedNowRandomPlaylist[0].url;
        setNowRandomPlaylist(updatedNowRandomPlaylist);
      }
    }

    if (!isRandom) {
      const nowIndex = nowPlayingPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );
      // playlist의 총 노래개수와 현재 노래의 index값+1이 같다면 = playlist의 마지막 노래라면
      if (nowPlayingPlaylist.length === nowIndex + 1) {
        prevMusicUrl = nowPlayingPlaylist[0].url;
        console.log("마지막 노래라면 재생시킬 노래: ", prevMusicUrl);
      } else {
        prevMusicUrl = nowPlayingPlaylist[nowIndex + 1].url;
        console.log("마지막 노래가 아니라면 재생시킬 노래: ", prevMusicUrl);
      }
    }

    if (prevMusicUrl) {
      // 콜백 함수 실행
      setMusicInfo(prevMusicUrl, (data) => {
        setPlayBarInfo(data);
      });
      setPlayBarUrl(prevMusicUrl);
    } else {
      return;
    }
  };

  //      event handler : 음악 정보 영역 클릭 이벤트 함수       //
  const handleMusicInfoClick = () => {
    if (playBarInfo && playBarInfo.vidUrl) {
      window.open(playBarInfo.vidUrl, "_blank");
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //  useEffect : playBarUrl 변경시 playBar에 노래 정보들이 set 될때까지 로딩 //
  // playBar변경시 버퍼링 대신 useEffect로 setIsLoading(true)로 로딩창 보여줌.
  // 이후 동영상 컴포넌트에서 handleReady() 함수로 setIsLoading(false)를 해줄꺼임.
  useEffect(() => {
    // 노래를 듣는중에 로그인이 만료될 경우 현재 듣는 노래를 제외한 노래 순서를 초기화.
    // 로그인 하지 않으면 다음 노래부터 못들음
    if (!cookies.accessToken || !loginUserInfo) {
      setNowRandomPlaylist([]);
      setNowPlayingPlaylist([]);
      setNowPlayingPlaylistID("");
      setNowRandomPlaylistID("");
      return;
    }

    if (playBarUrl !== "") {
      // true로 해준 뒤 ReactPlayer컴포넌트에서 준비 완료시 setIsLoading(false)를 해줌
      console.log("setIsLoading(true)실행");
      setIsLoading(true);
    }
  }, [playBarUrl]);

  // ================================= animationFrame 관련해서 알아보기
  const { currentTime, played, setPlayed } = usePlayerProgress(
    playerRef,
    isPlaying
  );

  const testBtn = () => {
    console.log("isPlaying : ", isPlaying);
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
        <div
          className={styles["main-wrap-bottom-left"]}
          style={{
            cursor: playBarInfo ? "pointer" : undefined,
          }}
          onClick={handleMusicInfoClick}
        >
          <div className={styles["main-wrap-play-img-box"]}>
            <div
              className={styles["main-wrap-play-img"]}
              style={{
                backgroundImage: `url(${playBarInfo?.thumb})`,
              }}
            ></div>
          </div>
          <div className={styles["main-wrap-play-info-box"]}>
            <div className={styles["main-wrap-play-title"]}>
              {playBarInfo?.vidTitle}
            </div>
            <div className={styles["main-wrap-play-artist"]}>
              {playBarInfo?.author}
            </div>
          </div>
        </div>
        <div className={styles["main-wrap-bottom-center"]}>
          <div className={styles["main-play-box"]}>
            <div className={styles["main-play-top"]}>
              <div className={styles["main-play-top-left"]}>
                <div
                  className={`${styles["main-play-loop-btn"]} ${
                    isLoop ? styles["loop-active"] : undefined
                  }`}
                  onClick={onLoopchange}
                ></div>
              </div>

              <div className={styles["main-play-top-mid"]}>
                <div
                  className={styles["main-play-prev-btn"]}
                  onClick={onPrevMusic}
                ></div>
                <div
                  className={
                    isPlaying
                      ? styles["main-pause-btn"]
                      : styles["main-play-btn"]
                  }
                  onClick={handlePlayPause}
                ></div>
                <div
                  className={styles["main-play-next-btn"]}
                  onClick={onNextMusic}
                ></div>
              </div>

              <div className={styles["main-play-top-right"]}>
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
            onClick={onSoundDropDown}
          ></div>
        </div>
      </div>
    </>
  );
};

export default PlayBar;
