import axios from "axios";
import AddPlayListToMusicRequestDto from "./request/add-playlist-to-music.dto";
import SignUpRequestDto from "./request/auth/sign-up-request.dto";
import SignUpResponseDto from "./response/auth/sign-up-response.dto";
import ResponseDto from "./response/response.dto";
import SignInRequestDto from "./request/auth/sign-in-request.dto";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import GetUserResponseDto from "./response/user/get-user-info-response.dto";
import CreatePlayListRequestDto from "./request/create-play-list-request.dto";
import GetUserImageResponseDto from "./response/user/get-user-new-image-url.dto";
import updatePlaylistNameRequestDto from "./request/update-playlist-name.dto";
import updatePlaylistOrderRequestDto from "./request/update-playlist-order.dto";
import accessTokenReissueResponseDto from "./response/auth/accessTokenReissue.response.dto";

// const DOMAIN = "http://172.30.40.137:8081";
// const DOMAIN = "http://localhost:8081";
const DOMAIN = process.env.REACT_APP_API_URL;
const API_DOMAIN = `${DOMAIN}/api`;

const authorication = (accessToken: string) => {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};
const errorResponse = (error: null | any) => {
  if (!error) return null;
  const responseBody: ResponseDto = error.response.data;
  return responseBody;
};

// 재생목록 추가
// + (누가 추가하는지 유저 정보 같이 보내기)
const ADD_PLAYLIST_URL = () => `${API_DOMAIN}/playlist/create`;
export const playlistCreateReqeust = async (
  requestBody: CreatePlayListRequestDto,
  accessToken: string
) => {
  const result = await axios
    .post(ADD_PLAYLIST_URL(), requestBody, authorication(accessToken))
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
const ADD_MUSIC_TO_PLAYLIST_URL = () => `${API_DOMAIN}/music/add`;
export const playlistAddMusicReqeust = async (
  requestBody: AddPlayListToMusicRequestDto,
  accessToken: string
) => {
  const result = await axios
    .post(ADD_MUSIC_TO_PLAYLIST_URL(), requestBody, authorication(accessToken))
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
const GET_PLAYLIST_LIBRARY_URL = () => `${API_DOMAIN}/playlist/get`;
export const getPlayListLibraryReqeust = async (accessToken: string) => {
  const result = await axios
    .get(GET_PLAYLIST_LIBRARY_URL(), authorication(accessToken))
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
const GET_PLAYLIS_URL = (playlistId: string | bigint) =>
  `${API_DOMAIN}/playlist/${playlistId}/musics`;
export const getPlaylistMusicReqeust = async (
  playlistId: string | bigint,
  accessToken: string
) => {
  const result = await axios
    .get(GET_PLAYLIS_URL(playlistId), authorication(accessToken))
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

// 엑세스토큰으로 회원 정보 가져오기
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

// =============== delete
// 노래 삭제
const DELETE_MUSIC = (musicId: bigint | string) =>
  `${API_DOMAIN}/music/delete/${musicId}`;
export const deleteMusic = async (
  musicId: bigint | string,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_MUSIC(musicId), authorication(accessToken))
    .then((response) => {
      const responseBody: ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 재생목록 삭제
const DELETE_PLAYLIST = (playlistId: bigint | string) =>
  `${API_DOMAIN}/playlist/delete/${playlistId}`;
export const deletePlaylist = async (
  playlistId: bigint | string,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_PLAYLIST(playlistId), authorication(accessToken))
    .then((response) => {
      const responseBody: ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// ===============
// 노래 복사
// const COPY_MUSIC = (musicId: bigint | string) =>
//   `${API_DOMAIN}/copy/music/${musicId}`;
// export const copyMusic = async (
//   musicId: bigint | string,
//   accessToken: string
// ) => {
//   console.log(
//     "노래 복사. 서버로 보내는 토큰 값 : " +
//       JSON.stringify(authorication(accessToken))
//   );
//   const result = await axios
//     .post(COPY_MUSIC(musicId), {}, authorication(accessToken))
//     .then((response) => {
//       const responseBody: ResponseDto = response.data;
//       return responseBody;
//     })
//     .catch((error) => {
//       return errorResponse(error);
//     });
//   return result;
// };

// 프로필 이미지 업로드 URL
// const UPLOAD_PROFILE_IMAGE_URL = () => `${DOMAIN}/file/upload`;
const UPLOAD_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/file/upload/profile`;
export const uploadProfileImageRequest = async (
  profileImage: string,
  file: File,
  accessToken: string
) => {
  // FormData 객체 생성
  const formData = new FormData();
  formData.append("file", file); // 서버에서 받을 파라미터 이름과 일치해야 함
  formData.append("prevImageUrl", profileImage); // 현재 프로필 이미지 set

  console.log("api. 서버로 보내는 formData 값 : ", formData);

  const result = await axios
    .post(UPLOAD_PROFILE_IMAGE_URL(), formData, authorication(accessToken))
    .then((response) => {
      const responseBody: GetUserImageResponseDto = response.data;
      console.log("api.서버에서 받아온 데이터 : ", responseBody);
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody = error.response?.data || null;
      return responseBody;
    });

  return result;
};

// 재생목록 이름 변경
const UPDATE_PLAYLIST_NAME_URL = (modifyPlaylistId: bigint | string) =>
  `${API_DOMAIN}/playlist/update/${modifyPlaylistId}`;
export const updatePlaylistNameRequest = async (
  requestBody: updatePlaylistNameRequestDto,
  modifyPlaylistId: bigint | string,
  accessToken: string
) => {
  const result = await axios
    .put(
      UPDATE_PLAYLIST_NAME_URL(modifyPlaylistId),
      requestBody,
      authorication(accessToken)
    )
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

// 음악 순서 변경
const UPDATE_PLAYLIST_ORDER_URL = (playlistId: string | bigint) =>
  `${API_DOMAIN}/music/update/order/${playlistId}`;
export const playlistOrderReqeust = async (
  playlistId: string | bigint,
  requestBody: updatePlaylistOrderRequestDto,
  accessToken: string
) => {
  const result = await axios
    .put(
      UPDATE_PLAYLIST_ORDER_URL(playlistId),
      requestBody,
      authorication(accessToken)
    )
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

// 토큰 만료로 토큰 재발급 요청
const TOKEN_REFRESH_URL = () => `${API_DOMAIN}/auth/refresh`;
export const accessTokenReissue = async (refreshToken: string) => {
  // await : 응답이 올 때까지 기다리겠다., requestBody: 어떤 데이터를 넣을 것인지
  const result = await axios
    .post(TOKEN_REFRESH_URL(), {}, authorication(refreshToken)) // 서버에 post요청
    .then((response) => {
      const responseBody: accessTokenReissueResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
