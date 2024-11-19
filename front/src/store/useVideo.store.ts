import { create } from "zustand";
import { YoutubeInfo } from "../types/interface/youtube.interface";
import Playlist from "../types/interface/playList.interface";

// Zustand 상태 정의
interface VideoState {
  isPlaying: boolean | false; // 재생 상태

  setIsPlaying: (playing: boolean) => void; // 재생 상태를 설정하는 함수

  // ========================================================================
  urlId: string | ""; // input URL 상태
  setUrlId: (urlId: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarUrl: string | ""; // playBar에 사용하는 Url 상태
  setPlayBarUrl: (playBarUrl: string | "") => void; // 비디오 URL을 설정하는 함수

  playBarInfo: YoutubeInfo | null;
  setPlayBarInfo: (info: YoutubeInfo) => void;

  // ============================================
  playlists: Playlist[]; // 재생목록 데이터 추가
  setPlaylists: (playlists: Playlist[]) => void; // 재생목록 설정 함수

  nowPlayingPlaylistID: string | undefined;
  setNowPlayingPlaylistID: (nowPlayingPlaylistID: string | undefined) => void;
}

// Zustand 스토어 생성
export const useVideoStore = create<VideoState>((set) => ({
  isPlaying: false, // 초기 재생 상태는 false (재생 중 아님)
  setIsPlaying: (playing) => set({ isPlaying: playing }), // 재생 상태 설정 함수 정의

  // ========================================================================
  urlId: "", // 초기 urlId 값은 ""
  setUrlId: (urlId) => set({ urlId: urlId }), // 비디오 URL을 설정하는 함수 정의

  playBarUrl: "", // playBar에 사용하는 Url
  setPlayBarUrl: (playBarUrl) => set({ playBarUrl: playBarUrl }), // 비디오 URL을 설정하는 함수 정의

  playBarInfo: null, // 초기값 설정
  setPlayBarInfo: (info) => set({ playBarInfo: info }), // playInfo 상태를 업데이트하는 함수

  // ============================================
  playlists: [], // 초기 재생목록은 빈 배열
  setPlaylists: (playlists) => set({ playlists }), // 재생목록 데이터를 설정하는 함수

  // 현재 재생중인 playList ID 설정
  nowPlayingPlaylistID: "",
  setNowPlayingPlaylistID: (nowPlayingPlaylistID) =>
    set({ nowPlayingPlaylistID: nowPlayingPlaylistID }),
}));
