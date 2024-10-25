import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideoStore";
import ReactPlayer from "react-player";

const PlayBar = () => {
  const {
    videoUrl,
    setVideoUrl,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    matchVideoUrl,
    setMatchVideoUrl,
  } = useVideoStore();

  useEffect(() => {
    handleDuration(duration);
  }, [matchVideoUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 시간 계산
  const formatTime = (time: number) => {
    if (isNaN(time)) {
      return;
    }
    const date = new Date(time * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  function pad(number: number) {
    return ("0" + number).slice(-2);
  }

  const [played, setPlayed] = useState<number>(0);
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
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const [currentTime, setCurrentTime] = useState<number>(0); // 현재 재생 시간

  return (
    <div className={styles["main-wrap-bottom"]}>
      <div className={styles["main-wrap-bottom-left"]}></div>
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
            <div className={styles["music-progress-bar-box"]}>
              <div
                className={styles["music-progress-fill"]}
                style={{
                  width: `${played * 100}%`,
                }}
              ></div>
              <ReactPlayer
                ref={playerRef}
                url={`youtu.be/${matchVideoUrl}`}
                playing={isPlaying}
                onProgress={handleProgress}
                onDuration={handleDuration}
                // volume={volume}
                style={{ display: "none" }} // 완전히 숨김 처리
              />
            </div>
            <div className={styles["music-full-time"]}>
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles["main-wrap-bottom-right"]}></div>
    </div>
  );
};

export default PlayBar;
