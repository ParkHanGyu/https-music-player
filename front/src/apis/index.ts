import axios from "axios";
import AddPlayListRequestDto from "./request/add-play-list-request.dto";
import AddPlayListToMusicRequestDto from "./request/add-playlist-to-music.dto";
import SignUpRequestDto from "./request/auth/sign-up-request.dto";
import SignUpResponseDto from "./response/auth/sign-up-response.dto";
import ResponseDto from "./response/response.dto";
import SignInRequestDto from "./request/auth/sign-in-request.dto";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import GetUserResponseDto from "./response/user/get-user-info-response.dto";

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
      console.log(
        "재생목록 >> 서버에서 넘어온 데이터 : " + JSON.stringify(responseBody)
      );
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
const GET_PLAYLIS_URL = (playlistId: string | bigint) =>
  `${API_DOMAIN}/playList/${playlistId}`;
export const getPlaylistMusicReqeust = async (playlistId: string | bigint) => {
  const result = await axios
    .get(GET_PLAYLIS_URL(playlistId))
    .then((response) => {
      const responseBody = response.data;
      console.log("서버에서 받아온 데이터 : " + JSON.stringify(responseBody));
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response.data;
      return responseBody;
    });
  return result;
};

// 회원가입
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), requestBody)
    .then((response) => {
      const responseBody: SignUpResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 로그인 요청
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
export const signInRequest = async (requestBody: SignInRequestDto) => {
  // await : 응답이 올 때까지 기다리겠다., requestBody: 어떤 데이터를 넣을 것인지
  const result = await axios
    .post(SIGN_IN_URL(), requestBody) // 서버에 post요청
    .then((response) => {
      const responseBody: SignInResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

const authorication = (accessToken: string) => {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};
// 로그인 회원 정보 가져오기
const GET_USER_INFO = () => `${API_DOMAIN}/user/get-info`;
export const getUserInfo = async (accessToken: string) => {
  const result = await axios
    .get(GET_USER_INFO(), authorication(accessToken))
    .then((response) => {
      const responseBody: GetUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
