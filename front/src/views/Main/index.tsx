import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import ReactPlayer from "react-player";

const Main = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [played, setPlayed] = useState<number>(0); // 진행률 (0 ~ 1)
  const playerRef = useRef<ReactPlayer | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const [currentTime, setCurrentTime] = useState<number>(0); // 현재 재생 시간
  // 진행도 자동 이동
  const handleProgress = (progress: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setPlayed(progress.played);
    setCurrentTime(progress.playedSeconds); // 현재 재생 시간
  };

  const [duration, setDuration] = useState<number>(0); // 전체 재생 시간
  // 전체 재생 시간
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // 사용자에 의한 진행도 수동 이동
  const handleSeek = (newPlayed: number) => {
    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  // 시간 계산
  function formatTime(time: number) {
    if (isNaN(time)) {
      return `00:00`;
    }
    const date = new Date(time * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  function pad(number: number) {
    return ("0" + number).slice(-2);
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
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

  useEffect(() => {
    if (played === 1) {
      setIsPlaying(!isPlaying);
    }
  }, [played]);

  return (
    <>
      <div className="main-wrap">
        <div className="main-wrap-top">
          <div className="main-left">
            <div className="main-search-box">
              <input
                className="main-search-input"
                type="text"
                placeholder="YouTube URL 입력"
                value={videoUrl}
                onChange={handleInputChange}
                style={{ width: "400px", marginRight: "10px" }}
              />
              <div className="main-search-btn" onClick={handlePlayPause}>
                {isPlaying ? ">" : ">>"}
              </div>
            </div>

            <div className="main-menu-box">
              <div className="main-menu-item1">All Tracks</div>
              <div className="main-menu-item2">PlayList</div>
              <div className="main-menu-item3">Youtube</div>
              <div className="main-menu-item4">SoundCloud</div>
            </div>
          </div>
          <div className="main-right">
            <div className="main-music-data-column-box">
              <div className="music-column-number">#</div>
              <div className="music-column-title">Title</div>
              <div className="music-column-artist">Artist</div>
              <div className="music-column-album">Album</div>
              <div className="music-column-duration">Duration</div>
            </div>

            <div className="main-music-data-info-box">
              <div className="music-info-number">1</div>

              <div className="music-info-image-title-box">
                <div className="music-info-image"></div>

                <div className="music-info-title flex-center">제목1</div>
              </div>

              <div className="music-info-artist">아티스트1</div>
              <div className="music-info-album">앨범1</div>
              <div className="music-info-duration">3:33</div>
            </div>

            <div className="main-music-data-info-box">
              <div className="music-info-number">1</div>

              <div className="music-info-image-title-box">
                <div className="music-info-image"></div>

                <div className="music-info-title flex-center">제목1</div>
              </div>

              <div className="music-info-artist">아티스트1</div>
              <div className="music-info-album">앨범1</div>
              <div className="music-info-duration">3:33</div>
            </div>
          </div>
        </div>

        <div className="main-wrap-bottom">
          <div className="main-wrap-bottom-left"></div>
          <div className="main-wrap-bottom-center">
            <div className="main-play-box">
              <div className="main-play-top">
                <div className="main-play-prev-btn"></div>
                <div
                  className={isPlaying ? "main-pause-btn" : "main-play-btn"}
                  onClick={handlePlayPause}
                ></div>
                <div className="main-play-next-btn"></div>
              </div>
              <div className="main-play-bottom">
                <div className="music-current-time">
                  {formatTime(currentTime)}
                </div>
                <div
                  className="music-progress-bar-box"
                  onMouseDown={handleMouseDown}
                  style={{
                    width: "400px",
                    height: "5px",
                    background: "#3f3f3f",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="music-progress-fill"
                    style={{
                      background: "#cacaca",
                      height: "100%",
                      width: `${played * 100}%`,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></div>
                  <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    style={{ display: "none" }} // 완전히 숨김 처리
                  />
                </div>
                <div className="music-full-time">{formatTime(duration)}</div>
              </div>
            </div>
          </div>

          <div className="main-wrap-bottom-right">
            <div className="music-sound-bar"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
