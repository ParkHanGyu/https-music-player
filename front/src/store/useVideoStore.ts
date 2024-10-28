import { create } from "zustand";
import { YoutubeInfo } from "../types/interface/youtube.interface";

// Zustand 상태 정의
interface VideoState {
  isPlaying: boolean; // 재생 상태

  setIsPlaying: (playing: boolean) => void; // 재생 상태를 설정하는 함수

  // ========================================================================
  urlId: string | ""; // input URL 상태
  setUrlId: (urlId: string | "") => void; // 비디오 URL을 설정하는 함수

  playUrl: string | ""; // playBar에 사용하는 Url 상태
  setPlayUrl: (playUrl: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarInfo: YoutubeInfo | null; // 추가된 부분
  setPlayBarInfo: (info: YoutubeInfo) => void; // 추가된 부분
}

// Zustand 스토어 생성
export const useVideoStore = create<VideoState>((set) => ({
  isPlaying: false, // 초기 재생 상태는 false (재생 중 아님)

  setIsPlaying: (playing) => set({ isPlaying: playing }), // 재생 상태 설정 함수 정의

  // ========================================================================
  urlId: "", // 초기 urlId 값은 ""
  setUrlId: (urlId) => set({ urlId: urlId }), // 비디오 URL을 설정하는 함수 정의

  playUrl: "", // playBar에 사용하는 Url
  setPlayUrl: (playUrl) => set({ playUrl: playUrl }), // 비디오 URL을 설정하는 함수 정의

  playBarInfo: null, // 초기값 설정
  setPlayBarInfo: (info) => set({ playBarInfo: info }), // playInfo 상태를 업데이트하는 함수
}));
