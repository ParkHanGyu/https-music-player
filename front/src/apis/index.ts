import axios from "axios";
import AddPlayListRequestDto from "./request/add-play-list-request.dto";
import AddPlayListToMusicRequestDto from "./request/add-playlist-to-music.dto";

const DOMAIN = "http://localhost:8081";
const API_DOMAIN = `${DOMAIN}/api`;

// 재생목록 추가
// + (누가 추가하는지 유저 정보 같이 보내기)
const ADD_PLAYLIST_URL = () => `${API_DOMAIN}/add/playList`;
export const playlistAddReqeust = async (
  requestBody: AddPlayListRequestDto
) => {
  const result = await axios
    .post(ADD_PLAYLIST_URL(), requestBody)
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response.data;
      return responseBody;
    });
  return result;
};

// 재생목록에 음악 추가
// + 이어서 작성하기
const ADD_MUSIC_TO_PLAYLIST_URL = () => `${API_DOMAIN}/add/playList_to_music`;
export const playlistAddMusicReqeust = async (
  requestBody: AddPlayListToMusicRequestDto
) => {
  const result = await axios
    .post(ADD_MUSIC_TO_PLAYLIST_URL(), requestBody)
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response.data;
      return responseBody;
    });
  return result;
};

// 재생목록 라이브러리 불러오기
const GET_PLAYLIST_LIBRARY_URL = (userName: string) =>
  `${API_DOMAIN}/playList?userName=${userName}`;
export const getPlayListLibraryReqeust = async (userName: string) => {
  const result = await axios
    .get(GET_PLAYLIST_LIBRARY_URL(userName))
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response.data;
      return responseBody;
    });
  return result;
};

// 메뉴에 재생목록 클릭시 음악 리스트 보여주기
// + 이어서 작성하기
const GET_PLAYLIS_URL = (playlistId: string | bigint) =>
  `${API_DOMAIN}/playList/${playlistId}`;
export const getPlaylistMusicReqeust = async (playlistId: string | bigint) => {
  const result = await axios
    .get(GET_PLAYLIS_URL(playlistId))
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response.data;
      return responseBody;
    });
  return result;
};
