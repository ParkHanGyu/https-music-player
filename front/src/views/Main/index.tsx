import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import ReactPlayer from "react-player";
import MusicInfo from "../../layouts/MusicInfo";
import { useOutletContext } from "react-router-dom";
import { useVideoStore } from "../../store/useVideoStore";

const Main = () => {
  const { matchVideoUrl, setMatchVideoUrl, setDuration, duration, setInfoUrl } =
    useVideoStore();

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

    console.log("progressBar : ", progressBar);
    console.log("rect : ", rect);
    console.log("offsetX : ", offsetX);
    console.log("newPlayed : ", newPlayed);

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

  const [urlMatch, setUrlMatch] = useState<string>("");

  const videoSearch = () => {
    // "youtu"을 포함한 경우
    if (videoUrl.includes("youtu")) {
      if (videoUrl.includes("www.")) {
        const urlMatch = videoUrl.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
        if (urlMatch) {
          const matchedId = urlMatch[0];

          setInfoUrl(matchedId);
          // 유튜브 영상 ID 추출 성공 시, 해당 ID로 matchVideoUrl 설정

          // setMatchVideoUrl(`youtu.be/${matchedId}`);
          // setIsPlaying(!isPlaying);
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

  // ===============기능 변경중===================

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-wrap-top-content"]}>
            {/* ================================================== */}
            <div className={styles["main-center"]}>
              <div className={styles["main-search-box"]}>
                <input
                  className={styles["main-search-input"]}
                  type="text"
                  placeholder="YouTube URL 입력"
                  value={videoUrl}
                  onChange={handleInputChange}
                />
                <div
                  className={styles["main-search-btn"]}
                  onClick={videoSearch}
                  // onClick={onSubmit}
                ></div>
              </div>

              <div className={styles["main-title-box"]}>
                A simple template for telling the world when you'll launch your
                next big thing. Brought to you by HTML5 UP.
              </div>
            </div>

            {/* ================================================== */}
          </div>

          <MusicInfo
          // videoUrl={urlMatch}
          // duration={duration}
          // setIsPlaying={setIsPlaying}
          // setMatchVideoUrl={setMatchVideoUrl}
          />
        </div>

        {/* <div className={styles["main-wrap-bottom"]}>
          <div className={styles["main-wrap-bottom-left"]}></div>
          <div className={styles["main-wrap-bottom-center"]}>
            <div className={styles["main-play-box"]}>
              <div className={styles["main-play-top"]}>
                <div className={styles["main-play-prev-btn"]}></div>
                <div
                  className={
                    isPlaying
                      ? styles["main-pause-btn"]
                      : styles["main-play-btn"]
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
                    url={matchVideoUrl}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    volume={volume}
                    style={{ display: "none" }} // 완전히 숨김 처리
                  />
                </div>
                <div className={styles["music-full-time"]}>
                  {formatTime(duration)}
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
        </div> */}
      </div>
    </>
  );
};

export default Main;
