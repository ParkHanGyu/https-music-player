import { create } from "zustand";
import MusicInfoAndLikeData from "../types/interface/music-info-and-like.interface";

// Zustand 상태 정의
interface VideoState {
  // ========================================================================
  mainSearchUrl: string | ""; // input URL 상태
  setMainSearchUrl: (mainSearchUrl: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarUrl: string | ""; // playBar에 사용하는 Url 상태
  setPlayBarUrl: (playBarUrl: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarInfo: MusicInfoAndLikeData | null;
  setPlayBarInfo: (info: MusicInfoAndLikeData) => void;
  resetPlayBarInfo: () => void; // playBarInfo 초기화 함수

  // ============================================
  // 로딩상태
  playlistLoading: boolean;
  setPlaylistLoading: (isLoading: boolean) => void;

  // // ====================
  // playBarDuration: number | 0;
  // setPlayBarDuration: (playBarDuration: number | 0) => void;
}

// Zustand 스토어 생성  - 초기값
export const useVideoStore = create<VideoState>((set) => ({
  // ========================================================================
  mainSearchUrl: "", // 초기 searchUrl 값은 ""
  setMainSearchUrl: (mainSearchUrl) => set({ mainSearchUrl: mainSearchUrl }), // 비디오 URL을 설정하는 함수 정의

  playBarUrl: "", // playBar에 사용하는 Url
  setPlayBarUrl: (playBarUrl) => set({ playBarUrl: playBarUrl }), // 비디오 URL을 설정하는 함수 정의

  playBarInfo: null, // 초기값 설정
  setPlayBarInfo: (info) => set({ playBarInfo: info }), // playInfo 상태를 업데이트하는 함수
  resetPlayBarInfo: () => set({ playBarInfo: null }), // playBarInfo 초기화 함수

  // 로딩상태
  playlistLoading: false,
  setPlaylistLoading: (playlistLoading) =>
    set({ playlistLoading: playlistLoading }),

  // 음악 리스트 상태 및 함수들

  // // ==========================
  // playBarDuration: 0,
  // setPlayBarDuration: (playBarDuration) =>
  //   set({ playBarDuration: playBarDuration }),
}));
