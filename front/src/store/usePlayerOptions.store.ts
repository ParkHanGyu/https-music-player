import { create } from "zustand";

// Zustand 상태 정의
interface VideoOptionState {
  isPlaying: boolean | false; // 재생 상태
  setIsPlaying: (playing: boolean) => void; // 재생 상태를 설정하는 함수
}

// Zustand 스토어 생성
export const usePlayerOptionStore = create<VideoOptionState>((set) => ({
  isPlaying: false, // 초기 재생 상태는 false (재생 중 아님)
  setIsPlaying: (playing) => set({ isPlaying: playing }), // 재생 상태 설정 함수 정의
}));
