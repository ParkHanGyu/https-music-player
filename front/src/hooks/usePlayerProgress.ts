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


    // requestAnimationFrame
    // 1초에 60번(60fps) 호출됨. 1번 호출때의 내용은
    // 1. isPlaying이 true로 바뀌면 useEffect로 updateProgress함수 실행
    // 2. PlayBar.tsx에서 사용하는 currentTime, played값을 변경 
    // 3. react는 상태가 변경되었음을 감지 -> 최신 상태를 위해 리렌더링
    // 4. 우리가 실제로 보는 PlayBar.tsx에 음악 진행도가 바뀜
    // 5. 여기서 원래는 끝나야 하지만 requestAnimationFrame(updateProgress)으로 인해 updateProgress 함수가 다시 실행
    // 6. 위의 순서 반복 (루프와 흡사함)
    // 그래서 언제까지 반복 하냐?
    // isPlaying이 false로 바뀌면 usePlayerProgress 커스텀훅의 useEffect 실행 되는데
    // 이때 isPlaying 값이 false면 cancelAnimationFrame를 실행되고 매개변수로 animationFrameRef.current을 받음
    // animationFrameRef.current은 예약 ID이고 해당 예약을 취소한다는 소리임
    // 처음에 requestAnimationFrame로 예약을 걸었을때(무한루프) 
    // animationFrameRef.current = requestAnimationFrame(updateProgress); 이렇게 해당 예약 ID를 생성했음 
    // 결국 cancelAnimationFrame(animationFrameRef.current);의 뜻은
    // animationFrameRef.current의 예약 ID를 가진 실행을 중단한다는 소리
  };

  useEffect(() => {
    if (isPlaying) {
      // 커스텀훅 useEffect 실행
      console.log("커스텀훅 useEffect 실행");
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
