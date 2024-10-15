import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";

const App: React.FC = () => {
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

  const handleProgress = (progress: { played: number }) => {
    setPlayed(progress.played);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(event.target.value);
    setPlayed(newPlayed);
    playerRef.current?.seekTo(newPlayed);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <input
        type="text"
        placeholder="YouTube URL 입력"
        value={videoUrl}
        onChange={handleInputChange}
        style={{ width: "400px", marginRight: "10px" }}
      />
      {/*  */}
      <button onClick={handlePlayPause}>
        {isPlaying ? "일시 정지" : "재생"}
      </button>
      {/*  */}
      <div style={{ marginTop: "20px" }}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          onProgress={handleProgress}
          style={{ display: "none" }} // 완전히 숨김 처리
        />
        <input
          type="range"
          min={0}
          max={1}
          step="0.01"
          value={played}
          onChange={handleSeek}
          style={{ width: "400px", marginTop: "10px" }}
        />
      </div>
    </div>
  );
};

export default App;
