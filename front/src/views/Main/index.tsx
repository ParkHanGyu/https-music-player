import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import ReactPlayer from "react-player";

const Main = () => {
  const [matchVideoUrl, setMatchVideoUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // 진행률 (0 ~ 1)
  const [played, setPlayed] = useState<number>(0);
  const playerRef = useRef<ReactPlayer | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const handlePlayPause = () => {
    // matchVideoUrl 값이 없을 경우(url을 입력하지 않았을 경우)
    if (!matchVideoUrl) {
      return;
    } else {
      // 있을 경우에는 play해줌
      setIsPlaying(!isPlaying);
    }
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
  }

  function pad(number: number) {
    return ("0" + number).slice(-2);
  }

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

  const videoSearch = () => {
    // "youtu"을 포함한 경우
    if (videoUrl.includes("youtu")) {
      if (videoUrl.includes("www.")) {
        const urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
        if (urlMatch) {
          // 유튜브 영상 ID 추출 성공 시, 해당 ID로 matchVideoUrl 설정
          setMatchVideoUrl(`youtu.be/${urlMatch[0]}`);
          setIsPlaying(!isPlaying);
        } else {
          alert("v=이 없을 경우 실행. urlMatch 값 : " + urlMatch);
          return;
        }
      } else {
        setMatchVideoUrl(videoUrl);
        setIsPlaying(!isPlaying);
      }
    } else {
      // "youtu"를 포함하지 않은 경우
      return;
    }
  };

  //  볼륨 관련 =====================================
  // 사운드바 드롭 상태
  const [soundDropdownOpen, setSoundDropdownOpen] = useState<boolean>(true);

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
    // 마우스 클릭 위치와 진행 바의 왼쪽 경계 간의 차이를 계산
    const offsetX = event.clientX - rect.left;
    // 진행 바에서 클릭한 위치를 비율로 나타냄
    const newVolume = Math.max(0, Math.min(1, offsetX / rect.width));
    handleVolumeChange(newVolume); // 볼륨 업데이트

    // const handleMouseMove = (moveEvent: MouseEvent) => {
    //   const offsetX = moveEvent.clientX - rect.left;
    //   const newVolume = Math.max(0, Math.min(1, offsetX / rect.height));
    //   handleVolumeChange(newVolume); // 볼륨 업데이트
    // };

    // const handleMouseUp = () => {
    //   window.removeEventListener("mousemove", handleMouseMove);
    //   window.removeEventListener("mouseup", handleMouseUp);
    // };

    // window.addEventListener("mousemove", handleMouseMove);
    // window.addEventListener("mouseup", handleMouseUp);
  };

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
              <div className="main-search-btn" onClick={videoSearch}>
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
                >
                  <div
                    className="music-progress-fill"
                    style={{
                      width: `${played * 100}%`,
                    }}
                  ></div>
                  <ReactPlayer
                    ref={playerRef}
                    url={matchVideoUrl}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    volume={volume}
                    style={{ display: "none" }} // 완전히 숨김 처리
                  />
                </div>
                <div className="music-full-time">{formatTime(duration)}</div>
              </div>
            </div>
          </div>

          <div className="main-wrap-bottom-right">
            {soundDropdownOpen ? (
              <div className="music-sound-bar-container">
                <div
                  className="music-sound-bar"
                  onMouseDown={handleMouseDownVolume}
                >
                  <div
                    className="music-sound-bar-fill"
                    style={{
                      height: `${volume * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="music-sound-icon" onClick={onSoundDropDown}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
