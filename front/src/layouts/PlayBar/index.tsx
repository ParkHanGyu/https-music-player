import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";

const PlayBar = () => {
  const { isPlaying, setIsPlaying, playBarUrl, playBarInfo } = useVideoStore();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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

  useEffect(() => {
    console.log(JSON.stringify(playBarInfo));
  }, [playBarInfo]);

  // ==============================================사운드바 끝
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
            <div className={styles["main-play-prev-btn"]}></div>
            <div
              className={
                isPlaying ? styles["main-pause-btn"] : styles["main-play-btn"]
              }
              onClick={handlePlayPause}
            ></div>
            <div className={styles["main-play-next-btn"]}></div>
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
                onProgress={handleProgress}
                onDuration={handleDuration}
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
