// YouTubeInfo.tsx
import React, { useState } from "react";
import styles from "./style.module.css";
import ReactPlayer from "react-player";

const TestView2 = () => {
  return (
    <div>
      <h2>SoundCloud Music</h2>
      <ReactPlayer
        url="https://youtu.be/eNlXPUp9WBw?si=3PToRMwC8cKklxbD
"
        playing={false} // 자동 재생
        controls={true} // 컨트롤 표시
        width="100%"
        height="120px" // 필요에 따라 높이 조정
      />
    </div>
  );
};

export default TestView2;
