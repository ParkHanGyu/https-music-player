import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";
import Music from "../../types/interface/music.interface";

const PlayBar = () => {
  const {
    isPlaying,
    setIsPlaying,
    playBarUrl,
    setPlayBarUrl,
    playBarInfo,
    setPlayBarInfo,
    nowPlayingPlaylist,
    setNowPlayingPlaylist,
  } = useVideoStore();

  const { youtube, getInfo } = useYoutubeInfo("");

  const handlePlayPause = () => {
    if (!isBuffering) {
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = useFormatTime();

  const [played, setPlayed] = useState<number>(0);

  // url 시간 상태
  const [playBarDuration, setPlayBarDuration] = useState<number>(0);

  const playerRef = useRef<ReactPlayer | null>(null);
  const handleProgress = (progress: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setPlayed(progress.played);
    setCurrentTime(progress.playedSeconds); // 현재 재생 시간
  };
  const handleDuration = (playBarDuration: number) => {
    setPlayBarDuration(playBarDuration);
  };

  const [currentTime, setCurrentTime] = useState<number>(0); // 현재 재생 시간

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

    console.log("event.clientX :  ", event.clientX);
    console.log("rect.left :  ", rect.left);
    // 진행 바에서 클릭한 위치를 비율로 나타냄
    const newPlayed = offsetX / rect.width;
    handleSeek(newPlayed);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const offsetX = moveEvent.clientX - rect.left;
      const newPlayed = Math.max(0, Math.min(1, offsetX / rect.width));
      handleSeek(newPlayed);
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
  const [soundDropdownOpen, setSoundDropdownOpen] = useState<boolean>(false);
  const soundDropdownRef = useRef<HTMLDivElement | null>(null); // 드롭다운 영역을 참조하기 위한 ref

  const onSoundDropDown = () => {
    setSoundDropdownOpen(!soundDropdownOpen);
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

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        soundDropdownOpen &&
        soundDropdownRef.current &&
        !soundDropdownRef.current.contains(event.target as Node)
      ) {
        setSoundDropdownOpen(false); // 영역 밖을 클릭하면 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [soundDropdownOpen]);

  // ==============================================사운드바 끝
  const [isBuffering, setIsBuffering] = useState<boolean>(true); // 버퍼링 상태
  const handleBuffer = () => {
    console.log("handleBuffer");
    setIsBuffering(true); // 버퍼링 시작
  };

  const handleBufferEnd = () => {
    console.log("handleBufferEnd");
    setIsBuffering(false); // 버퍼링 종료
  };

  const handleReady = () => {
    console.log("handleReady"); // 비디오 준비 완료 시 호출
    setIsPlaying(true);
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
    if (!isLoop) {
      setIsPlaying(!isPlaying);
    }
  };

  const shuffle = (playlist: Music[]) => {
    const copiedPlaylist = [...playlist]; // 배열 복사
    return copiedPlaylist.sort(() => Math.random() - 0.5); // 셔플된 배열 반환
  };

  const testBtn = () => {
    const shuffleList = shuffle(nowPlayingPlaylist);
    console.log("셔플한 shuffleList 값 : ", shuffleList);
    console.log("원본 nowPlayingPlaylist 값 : ", nowPlayingPlaylist);

    // 재생중인 재생목록에서 재생중인 노래 제외하기
    const nowIndex = nowPlayingPlaylist.findIndex((music) =>
      music.url.includes(playBarUrl)
    );

    const filteredPlaylist = nowPlayingPlaylist.filter(
      (_, index) => index !== nowIndex
    );

    alert("원래 nowPlayingPlaylist 값 : " + JSON.stringify(nowPlayingPlaylist));
    alert("현재 재생 노래 index값 : " + JSON.stringify(nowIndex));

    alert(
      "현재 노래를 제외한 filteredPlaylist 값 : " +
        JSON.stringify(filteredPlaylist)
    );
    setNowPlayingPlaylist(filteredPlaylist);
  };

  // ============== 이전 음악
  const onPrevMusic = () => {
    let prevMusicUrl;

    // 근데 랜덤이 활성화 되어 있다면
    if (isRandom) {
      // 현재 재생중인 index
      const nowIndex = nowPlayingPlaylist.findIndex((music) =>
        music.url.includes(playBarUrl)
      );
      // 재생중인 재생목록에서 재생중인 노래 제외하기
      const filteredPlaylist = nowPlayingPlaylist.filter(
        (_, index) => index !== nowIndex
      );
      const shuffleList = shuffle(filteredPlaylist);
      setNowPlayingPlaylist(shuffleList);
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

    if (!prevMusicUrl) {
      return;
    }

    if (prevMusicUrl.includes("youtu")) {
      let urlMatch; // urlMatch를 조건문 밖에서 선언

      // www이 포함되어 있을때
      if (prevMusicUrl.includes("www.")) {
        urlMatch = prevMusicUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
      }

      // www이 없고 ?si=를 포함할 경우
      else if (prevMusicUrl.includes("?si=")) {
        urlMatch = prevMusicUrl.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
      }
      // https://youtu.be/로 시작할 때
      else {
        urlMatch = prevMusicUrl.match(
          /(?<=https:\/\/youtu.be\/)[a-zA-Z0-9_-]+/
        );
      }

      if (urlMatch) {
        getInfo(urlMatch[0]);
        setPlayBarUrl(urlMatch[0]);
      }
    }
  };

  // ============== 다음 음악
  const onNextMusic = () => {
    // 재생목록에서 현재 음악 index값
    const nowIndex = nowPlayingPlaylist.findIndex((music) =>
      music.url.includes(playBarUrl)
    );

    // playlist의 총 노래개수와 현재 노래의 index값+1이 같다면 = playlist의 마지막 노래라면
    let prevMusicUrl; // urlMatch를 조건문 밖에서 선언
    if (nowPlayingPlaylist.length === nowIndex + 1) {
      prevMusicUrl = nowPlayingPlaylist[0].url;
    } else {
      prevMusicUrl = nowPlayingPlaylist[nowIndex + 1].url;
    }

    if (prevMusicUrl.includes("youtu")) {
      let urlMatch; // urlMatch를 조건문 밖에서 선언

      // www이 포함되어 있을때
      if (prevMusicUrl.includes("www.")) {
        urlMatch = prevMusicUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
      }

      // www이 없고 ?si=를 포함할 경우
      else if (prevMusicUrl.includes("?si=")) {
        urlMatch = prevMusicUrl.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
      }
      // https://youtu.be/로 시작할 때
      else {
        urlMatch = prevMusicUrl.match(
          /(?<=https:\/\/youtu.be\/)[a-zA-Z0-9_-]+/
        );
      }

      if (urlMatch) {
        getInfo(urlMatch[0]);
        setPlayBarUrl(urlMatch[0]);
      }
    }
  };

  useEffect(() => {
    if (youtube.vidUrl !== "-") {
      setPlayBarInfo(youtube);
    }
  }, [youtube]);

  return (
    <div className={styles["main-wrap-bottom"]}>
      <div className={styles["main-wrap-bottom-left"]}>
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
              {isLoop ? (
                <div
                  className={`${styles["main-play-loop-btn"]} ${styles["loop-active"]}`}
                  onClick={onLoopchange}
                ></div>
              ) : (
                <div
                  className={styles["main-play-loop-btn"]}
                  onClick={onLoopchange}
                ></div>
              )}
            </div>

            <div className={styles["main-play-top-mid"]}>
              <div
                className={styles["main-play-prev-btn"]}
                onClick={onPrevMusic}
              ></div>
              <div
                className={
                  isPlaying ? styles["main-pause-btn"] : styles["main-play-btn"]
                }
                onClick={handlePlayPause}
              ></div>
              <div
                className={styles["main-play-next-btn"]}
                onClick={onNextMusic}
              ></div>
            </div>

            <div className={styles["main-play-top-right"]}>
              {isRandom ? (
                <div
                  className={`${styles["main-play-random-btn"]} ${styles["random-active"]}`}
                  onClick={onRandomchange}
                  // onClick={testBtn}
                ></div>
              ) : (
                <div
                  className={styles["main-play-random-btn"]}
                  onClick={onRandomchange}
                  // onClick={testBtn}
                ></div>
              )}
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
                url={`youtu.be/${playBarUrl}`}
                playing={isPlaying}
                onBuffer={handleBuffer} // 버퍼링 시작 이벤트
                onBufferEnd={handleBufferEnd} // 버퍼링 종료 이벤트
                onReady={handleReady}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleEnded}
                loop={isLoop}
                volume={volume}
                style={{ display: "none" }} // 완전히 숨김 처리
              />
            </div>
            <div className={styles["music-full-time"]}>
              {formatTime(playBarDuration)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles["main-wrap-bottom-right"]}>
        {soundDropdownOpen && (
          <div
            className={styles["music-sound-bar-container"]}
            ref={soundDropdownRef}
          >
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
  );
};

export default PlayBar;
