// src/App.tsx
import React, { useState } from "react";
import ReactPlayer from "react-player";

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>YouTube 음원 플레이어</h1>
      <input
        type="text"
        placeholder="YouTube URL 입력"
        value={videoUrl}
        onChange={handleInputChange}
        style={{ width: "400px", marginRight: "10px" }}
      />
      <button onClick={handlePlayPause}>
        {isPlaying ? "일시 정지" : "재생"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {videoUrl && (
          <ReactPlayer
            url={videoUrl}
            playing={isPlaying}
            controls={true}
            width="0" // 가로 크기 0으로 설정
            height="0" // 세로 크기 0으로 설정
          />
        )}
      </div>
    </div>
  );
};

export default App;
