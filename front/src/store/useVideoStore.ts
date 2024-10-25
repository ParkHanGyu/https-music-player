import { create } from "zustand";

// Zustand 상태 정의
interface VideoState {
  videoUrl: string | null; // input URL 상태
  infoUrl: string | ""; // input URL 상태
  matchVideoUrl: string | ""; // ID
  isPlaying: boolean; // 재생 상태
  duration: number | 0; // 비디오 시간

  setVideoUrl: (url: string | null) => void; // 비디오 URL을 설정하는 함수
  setInfoUrl: (infoUrl: string | "") => void; // 비디오 URL을 설정하는 함수
  setMatchVideoUrl: (matchUrl: string | "") => void; // 비디오 URL을 설정하는 함수
  setIsPlaying: (playing: boolean) => void; // 재생 상태를 설정하는 함수
  setDuration: (time: number | 0) => void; // 비디오 시간을 설정하는 함수
}

// Zustand 스토어 생성
export const useVideoStore = create<VideoState>((set) => ({
  videoUrl: null, // 초기 videoUrl 값은 null
  infoUrl: "", // 초기 infoUrl 값은 null
  matchVideoUrl: "",
  isPlaying: false, // 초기 재생 상태는 false (재생 중 아님)
  duration: 0, // 초기 duration 값은 null

  setVideoUrl: (url) => set({ videoUrl: url }), // 비디오 URL을 설정하는 함수 정의
  setInfoUrl: (infoUrl) => set({ infoUrl: infoUrl }), // 비디오 URL을 설정하는 함수 정의
  setMatchVideoUrl: (matchUrl) => set({ matchVideoUrl: matchUrl }), // 비디오 URL을 설정하는 함수 정의
  setIsPlaying: (playing) => set({ isPlaying: playing }), // 재생 상태 설정 함수 정의
  setDuration: (time) => set({ duration: time }), // 비디오 시간을 설정하는 함수 정의
}));
