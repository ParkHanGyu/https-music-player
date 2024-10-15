import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import ReactPlayer from "react-player";

const Main = () => {
  // const testOnClick = () => {
  //   testApi().then(testResponse);
  // };

  const testResponse = (responseBody: any) => {
    alert(responseBody);
  };

  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const handlePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  //   if (isPlaying) {
  //     // 음악 일시정지 로직
  //     console.log("음악 일시정지");
  //   } else {
  //     // 음악 재생 로직
  //     console.log("음악 재생");
  //   }
  // };

  // =========================음악 진행도
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      // 진행도를 업데이트하는 로직 (0에서 100 사이의 값)
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 2000); // 1초마다 진행도 업데이트

    return () => clearInterval(interval);
  }, []);

  // =============================추가
  const [videoUrl, setVideoUrl] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleProgress = (progress: { played: number }) => {
    setPlayed(progress.played);
  };
  const [played, setPlayed] = useState<number>(0); // 진행률 (0 ~ 1)

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(event.target.value);
    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  return (
    <>
      <div className="main-wrap">
        <div className="main-wrap-top">
          <div className="main-left">
            <div className="main-search-box">
              {/* <input className="main-search-input" type="text" /> */}
              <input
                type="text"
                placeholder="YouTube URL 입력"
                value={videoUrl}
                onChange={handleInputChange}
                style={{ width: "400px", marginRight: "10px" }}
              />
              <div className="main-search-btn">
                <button onClick={handlePlayPause}>
                  {isPlaying ? "일시 정지" : "재생"}
                </button>
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
                <div className="music-current-time">0:14</div>
                <div className="music-progress-bar-box">
                  <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    style={{ display: "none" }} // 완전히 숨김 처리
                  />
                  <input
                    id="music-progress-bar"
                    type="range"
                    min={0}
                    max={1}
                    step="0.01"
                    value={played}
                    onChange={handleSeek}
                    style={{ width: "400px", height: "5px" }}
                  />
                </div>
                <div className="music-full-time">3:31</div>
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
