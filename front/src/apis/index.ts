import axios from "axios";

const DOMAIN = "http://localhost:8081";

const API_DOMAIN = `${DOMAIN}/api`;

const TEST_URL = () => `${API_DOMAIN}/hello`;
export const testApi = async () => {
  const result = await axios
    .get(TEST_URL())
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
