import { create } from "zustand";
import { YoutubeInfo } from "../types/interface/youtube.interface";

// Zustand 상태 정의
interface VideoState {
  // ========================================================================
  urlId: string | ""; // input URL 상태
  setUrlId: (urlId: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarUrl: string | ""; // playBar에 사용하는 Url 상태
  setPlayBarUrl: (playBarUrl: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarInfo: YoutubeInfo | null;
  setPlayBarInfo: (info: YoutubeInfo) => void;

  // ============================================

  // 로딩상태

  isLoading: boolean | true;
  setIsLoading: (isLoading: boolean) => void;
}

// Zustand 스토어 생성
export const useVideoStore = create<VideoState>((set) => ({
  // ========================================================================
  urlId: "", // 초기 urlId 값은 ""
  setUrlId: (urlId) => set({ urlId: urlId }), // 비디오 URL을 설정하는 함수 정의

  playBarUrl: "", // playBar에 사용하는 Url
  setPlayBarUrl: (playBarUrl) => set({ playBarUrl: playBarUrl }), // 비디오 URL을 설정하는 함수 정의

  playBarInfo: null, // 초기값 설정
  setPlayBarInfo: (info) => set({ playBarInfo: info }), // playInfo 상태를 업데이트하는 함수

  // 로딩상태
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),

  // 음악 리스트 상태 및 함수들
}));
