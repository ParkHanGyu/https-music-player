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

const PlayBar = () => {
  const [cookies] = useCookies();
  const { playBarUrl, setPlayBarUrl, playBarInfo, setPlayBarInfo } =
    useVideoStore();
  const {
    nowPlayingPlaylist,
    nowPlayingPlaylistID,
    nowRandomPlaylist,
    nowRandomPlaylistID,
    setNowRandomPlaylist,
    setNowPlayingPlaylist,
    setNowPlayingPlaylistID,
    setNowRandomPlaylistID,
  } = usePlaylistStore();

  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  const { playlistId } = useParams();

  const { infoData, setMusicInfo } = useMediaInfo("");
  // 정규식 커스텀 훅

  const handlePlayPause = () => {
    if (isBuffering === false) {
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = useFormatTime();

  // const [played, setPlayed] = useState<number>(0);

  // url 시간 상태
  const [playBarDuration, setPlayBarDuration] = useState<number>(0);

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleDuration = (playBarDuration: number) => {
    setPlayBarDuration(playBarDuration);
  };

  // ============================영상 진행도 조절
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

  // ============================ 영상 볼륨 진행도 조절
  // 사운드바 드롭 상태
  // const [soundDropdownOpen, setSoundDropdownOpen] = useState<boolean>(false);
  // const soundDropdownRef = useRef<HTMLDivElement | null>(null); // 드롭다운 영역을 참조하기 위한 ref

  const onSoundDropDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const [volume, setVolume] = useState<number>(1); // 초기 볼륨을 최대값으로 설정

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

  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLDivElement>(false);

  // ==============================================사운드바 끝
  const [isBuffering, setIsBuffering] = useState<boolean>(true); // 버퍼링 상태
  const handleBuffer = () => {
    setIsBuffering(true); // 버퍼링 시작
  };

  const handleBufferEnd = () => {
    setIsBuffering(false); // 버퍼링 종료
  };

  const handleReady = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 800);
  };
  // ================= 반복재생 관련
  const [isLoop, setIsLoop] = useState<boolean>(false); // 노래 반복 여부

  const onLoopchange = () => {
    setIsLoop(!isLoop);
  };

  // ================= 랜덤재생 관련
  const [isRandom, setIsRandom] = useState<boolean>(false); // 노래 랜덤 여부

  const onRandomchange = () => {
    setIsRandom(!isRandom);
  };

  // ============ 영상 끝나면 실행되는 함수
  const handleEnded = () => {
    if (playerRef.current && isLoop) {
      // url이 soundcloud면 url 다시 넣어줌
      if (playBarUrl.includes("soundcloud")) {
        const nowMusic = playBarUrl;
        setPlayBarUrl(""); // URL을 초기화
        setTimeout(() => setPlayBarUrl(nowMusic), 0); // 다시 URL 설정
      } else {
        // soundcloud가 아닐경우 (유튜브일경우) 동영상 진행도 0으로
        playerRef.current.seekTo(0);
      }
    } else if (!isLoop) {
      onNextMusic();
    }
  };

  const shuffle = (playlist: Music[]) => {
    const copiedPlaylist = [...playlist]; // 배열 복사
    return copiedPlaylist.sort(() => Math.random() - 0.5); // 셔플된 배열 반환
  };

  const testBtn = () => {
    console.log("nowPlayingPlaylist : ", nowPlayingPlaylist);
    console.log("nowRandomPlaylist : ", nowRandomPlaylist);
    console.log("nowPlayingPlaylistID : ", nowPlayingPlaylistID);
    console.log("nowRandomPlaylistID : ", nowRandomPlaylistID);
    console.log("nowRandomPlaylistID : ", nowRandomPlaylistID);
    console.log("cookies.accessToken : ", cookies.accessToken);
  };

  useEffect(() => {
    if (
      nowPlayingPlaylist.length !== 0 &&
      nowRandomPlaylist.length === 0 &&
      nowRandomPlaylist !== nowPlayingPlaylist
    ) {
      console.log("랜덤 재생중에 랜덤재생목록의 노래가 다 떨어질 경우");
      setNowRandomPlaylist(nowPlayingPlaylist);
    }
  }, [nowRandomPlaylist]);

  // ============== 이전 음악
  const onPrevMusic = () => {
    if (Array.isArray(nowPlayingPlaylist) && nowPlayingPlaylist.length === 0) {
      alert("노래가 없음");
      return;
    }
    let prevMusicUrl;

    if (isRandom) {
      // 현재 재생중인 index
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );
      // 재생중인 재생목록에서 재생중인 노래 제외하기
      const filteredPlaylist = nowRandomPlaylist.filter(
        (_, index) => index !== nowIndex
      );
      // 배열 랜덤
      let shuffleList = shuffle(filteredPlaylist);
      console.log("shuffleList : ", shuffleList.length);

      if (shuffleList.length === 0) {
        shuffleList = nowPlayingPlaylist;
      }

      setNowRandomPlaylist(shuffleList);
      prevMusicUrl = shuffleList[0].url;
    }

    if (!isRandom) {
      // 재생목록에서 현재 음악 index값
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
      setMusicInfo(prevMusicUrl);
      setPlayBarUrl(prevMusicUrl);
    } else {
      return;
    }
  };

  // ============== 다음 음악
  const onNextMusic = () => {
    if (Array.isArray(nowPlayingPlaylist) && nowPlayingPlaylist.length === 0) {
      alert("노래가 없음");
      return;
    }
    let prevMusicUrl; // urlMatch를 조건문 밖에서 선언

    if (isRandom) {
      // 재생목록에서 현재 음악 index값
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );

      // 재생중인 재생목록에서 재생중인 노래 제외하기
      const filteredPlaylist = nowRandomPlaylist.filter(
        (_, index) => index !== nowIndex
      );

      let shuffleList = shuffle(filteredPlaylist);
      if (shuffleList.length === 0) {
        shuffleList = nowPlayingPlaylist;
      }
      setNowRandomPlaylist(shuffleList);
      prevMusicUrl = shuffleList[0].url;
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
      setMusicInfo(prevMusicUrl);
      setPlayBarUrl(prevMusicUrl);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (infoData.vidUrl !== "-") {
      setPlayBarInfo(infoData);
    }
  }, [infoData]);

  useEffect(() => {
    // nowPlayingPlaylist에 playBarUrl이 포함된 항목이 있으면 true
    const isUrlPresent = nowPlayingPlaylist.some((music) =>
      music.url.includes(playBarUrl)
    );

    // Playlist 컴포넌트에서 음악을 삭제했을때
    // 어떤 조건하에 nowPlayingPlaylist가 변경.
    // 현재 듣는 음악이 내가 제외한 playlist의 음악일경우 다음 음악으로.
    if (playlistId === nowPlayingPlaylistID && !isUrlPresent) {
      if (
        Array.isArray(nowPlayingPlaylist) &&
        nowPlayingPlaylist.length === 0
      ) {
        setPlayBarUrl("");
        setIsPlaying(false);
        setPlayBarDuration(0);
        return;
      }
    }
  }, [nowPlayingPlaylist]);

  const handleMusicInfoClick = () => {
    if (playBarInfo && playBarInfo.vidUrl) {
      window.open(playBarInfo.vidUrl, "_blank");
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 노래가 바뀌었을때 playBar에 노래 정보들이 set 될때까지 로딩
  useEffect(() => {
    if (!cookies.accessToken) {
      setNowRandomPlaylist([]);
      setNowPlayingPlaylist([]);
      setNowPlayingPlaylistID("");
      setNowRandomPlaylistID("");
      return;
    }

    if (playBarUrl !== "") {
      setIsLoading(true);
    }
  }, [playBarUrl]);

  // ================================= animationFrame 관련해서 알아보기
  const { currentTime, played, setPlayed } = usePlayerProgress(
    playerRef,
    isPlaying
  );

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className={styles["loading-overlay"]}>
          <div className={styles["loading-spinner"]}></div>
        </div>
      )}

      <div
        className={`${styles["main-wrap-bottom"]} ${
          isLoading ? styles["blur"] : ""
        }`}
      >
        <div
          className={styles["main-wrap-bottom-left"]}
          style={{
            cursor: playBarInfo ? "pointer" : "",
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
                    isLoop ? styles["loop-active"] : ""
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
                    isRandom ? styles["random-active"] : ""
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
                  onBuffer={handleBuffer} // 버퍼링 시작 이벤트
                  onBufferEnd={handleBufferEnd} // 버퍼링 종료 이벤트
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

          <div className={styles["music-sound-icon"]} onClick={testBtn}></div>
        </div>
      </div>
    </>
  );
};

export default PlayBar;
