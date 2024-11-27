// YouTubeInfo.tsx
import React, { useState } from "react";
import styles from "./style.module.css";

const TestView2 = () => {
  const [nowPlayingPlaylist, setNowPlayingPlaylist] = useState<any[]>([]); // 현재 플레이리스트
  const [nowIndex, setNowIndex] = useState<number>(0); // 현재 인덱스
  const [isRandom, setIsRandom] = useState<boolean>(false); // 랜덤 모드 상태

  // 초기 플레이리스트 예시 (여기에 실제 데이터를 넣을 수 있습니다)
  const initialPlaylist = [
    { id: 1, name: "Song 1" },
    { id: 2, name: "Song 2" },
    { id: 3, name: "Song 3" },
  ];

  // 상태 초기화 함수
  const resetPlaylist = (randomState: boolean) => {
    if (randomState) {
      // 랜덤 모드일 때, 필터링된 상태 사용
      setNowPlayingPlaylist((prevPlaylist) =>
        prevPlaylist.filter((item, index) => index !== nowIndex)
      );
    } else {
      // 랜덤이 아닐 때, 초기 상태로 복원
      setNowPlayingPlaylist([...initialPlaylist]); // 초기 상태로 되돌리기
      setNowIndex(0); // 인덱스 초기화
    }
  };

  const toggleRandom = () => {
    const newRandomState = !isRandom;
    setIsRandom(newRandomState); // 랜덤 모드 상태 변경
    resetPlaylist(newRandomState); // 플레이리스트 상태 초기화
  };
  return (
    <div className={styles["main-wrap"]}>
      <div>
        <button onClick={toggleRandom}>Toggle Random</button>
        <div>
          <h2>Now Playing Playlist</h2>
          <ul>
            {nowPlayingPlaylist.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Current Index: {nowIndex}</h3>
        </div>
      </div>
    </div>
  );
};

export default TestView2;
