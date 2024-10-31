import axios from "axios";
import AddPlayListRequestDto from "./request/add-play-list-request.dto";

const DOMAIN = "http://localhost:8081";
const API_DOMAIN = `${DOMAIN}/api`;

const PLAYLIST_ADD_URL = () => `${API_DOMAIN}/add/playList`;
export const playListAdd = async (requestBody: AddPlayListRequestDto) => {
  const result = await axios
    .post(PLAYLIST_ADD_URL(), requestBody)
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

const GET_PLAYLIST = (userName: string) =>
  `${API_DOMAIN}/playList?userName=${userName}`;
export const getPlayListReqeust = async (userName: string) => {
  const result = await axios
    .get(GET_PLAYLIST(userName))
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
