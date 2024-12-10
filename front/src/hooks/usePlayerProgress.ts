import { useRef, useEffect, useState } from "react";

const usePlayerProgress = (
  playerRef: React.RefObject<any>,
  isPlaying: boolean
) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [played, setPlayed] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateProgress = () => {
    if (playerRef.current) {
      const playedSeconds = playerRef.current.getCurrentTime(); // 현재 재생 시간
      const duration = playerRef.current.getDuration(); // 전체 재생 시간
      const played = duration ? playedSeconds / duration : 0; // 재생 비율 계산

      setCurrentTime(playedSeconds);
      setPlayed(played);
    }

    // 다음 프레임 요청
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    if (isPlaying) {
      updateProgress(); // 재생 중이면 진행도 업데이트 시작
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current); // 정지 시 애니메이션 취소
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current); // 컴포넌트 언마운트 시 정리
      }
    };
  }, [isPlaying]);

  return { currentTime, played, setPlayed };
};

export default usePlayerProgress;
