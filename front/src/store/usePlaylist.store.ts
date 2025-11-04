import { create } from "zustand";
import Playlist from "../types/interface/playList.interface";
import Music from "../types/interface/music.interface";

// Zustand 상태 정의
interface VideoState {
  // ========================== 재생목록 모음
  playlistLibrary: Playlist[]; // 재생목록 모음
  setPlaylistLibrary: (playlistLibrary: Playlist[]) => void; // 재생목록 설정 함수

  // ======================== 현재 재생중인 재생목록의 음악들
  nowPlayingPlaylist: Music[]; // 음악 리스트 상태
  setNowPlayingPlaylist: (musics: Music[]) => void; // 음악 리스트 설정 함수

  nowPlayingPlaylistID: string | undefined;
  setNowPlayingPlaylistID: (nowPlayingPlaylistID: string | undefined) => void;

  // ======================== 현재 재생중인 랜덤용 재생목록의 음악들
  nowRandomPlaylist: Music[]; // 음악 리스트 상태
  setNowRandomPlaylist: (musics: Music[]) => void; // 음악 리스트 설정 함수
  addMusic: (music: Music) => void; // 음악 추가 함수
  removeMusic: (id: bigint) => void; // 음악 제거 함수

  nowRandomPlaylistID: string | undefined;
  setNowRandomPlaylistID: (nowRandomPlaylistID: string | undefined) => void;
  // ======================== 현재 보는 재생목록 음악들
  musics: Music[]; // 현재 보는 재생목록 음악들
  setMusics: (musics: Music[]) => void;

  // ======================== 현재 재생중인 플레이리스트 view state
  playBarModeState: boolean;
  setPlayBarModeState: (playBarModeState: boolean) => void;
}

// Zustand 스토어 생성
export const usePlaylistStore = create<VideoState>((set) => ({
  // ============================================
  playlistLibrary: [], // 초기 재생목록은 빈 배열
  setPlaylistLibrary: (playlistLibrary) => set({ playlistLibrary }), // 재생목록 데이터를 설정하는 함수

  // 현재 재생중인 playList ID 설정
  nowPlayingPlaylistID: "",
  setNowPlayingPlaylistID: (nowPlayingPlaylistID) =>
    set({ nowPlayingPlaylistID: nowPlayingPlaylistID }),

  // 음악 리스트 상태 및 함수들
  nowPlayingPlaylist: [],
  setNowPlayingPlaylist: (nowPlayingPlaylist) => set({ nowPlayingPlaylist }),
  // ============================================

  // 음악 랜덤 리스트 상태 및 함수들
  nowRandomPlaylist: [],
  setNowRandomPlaylist: (nowRandomPlaylist) => set({ nowRandomPlaylist }),
  addMusic: (music) =>
    set((state) => ({
      nowRandomPlaylist: [...state.nowRandomPlaylist, music],
    })),
  removeMusic: (id) =>
    set((state) => ({
      nowRandomPlaylist: state.nowRandomPlaylist.filter(
        (nowRandomPlaylist) => nowRandomPlaylist.musicId !== id
      ),
    })),

  nowRandomPlaylistID: "",
  setNowRandomPlaylistID: (nowRandomPlaylistID) =>
    set({ nowRandomPlaylistID: nowRandomPlaylistID }),

  // ======================== 현재 보는 재생목록 음악들
  musics: [], // 현재 보는 재생목록 음악들
  setMusics: (musics) => set({ musics }),

  // ======================== 현재 재생중인 플레이리스트 view state
  playBarModeState: false,
  setPlayBarModeState: (playBarModeState) =>
    set({ playBarModeState: playBarModeState }),
}));
