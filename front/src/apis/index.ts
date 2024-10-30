import axios from "axios";
import AddPlayListRequestDto from "./request/add-play-list-request.dto";

const DOMAIN = "http://localhost:8081";
const API_DOMAIN = `${DOMAIN}/api`;

const TEST_URL = () => `${API_DOMAIN}/add/playList`;
export const testApi = async (requestBody: AddPlayListRequestDto) => {
  const result = await axios
    .post(TEST_URL(), requestBody)
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
