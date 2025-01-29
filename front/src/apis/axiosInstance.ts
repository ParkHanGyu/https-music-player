import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://your-api-url.com"; // 백엔드 서버 주소

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 자동 포함
});

// ✅ 토큰 만료 여부 확인 함수
const isAccessTokenExpired = (accessToken: string | undefined) => {
  if (!accessToken) return true;
  try {
    const decoded: { exp: number } = jwtDecode(accessToken); // `jwt-decode` 사용
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// ✅ 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  async (config: any) => {
    // config를 any로 처리
    // 🔹 `skipAuth: true`가 설정된 경우, 토큰 검사 없이 바로 요청
    if (config.skipAuth) {
      return config;
    }

    let accessToken = localStorage.getItem("accessToken") || undefined;

    if (isAccessTokenExpired(accessToken)) {
      console.log("🔴 엑세스 토큰 만료됨, 재발급 요청");
      try {
        // 🔹 리프레시 토큰으로 새 엑세스 토큰 가져오기
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        accessToken = response.data.accessToken;

        // accessToken이 undefined가 아니면 localStorage에 저장
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      } catch (error) {
        console.log("⚠️ 리프레시 토큰도 만료됨. 로그아웃 필요");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // 🔹 유효한 액세스 토큰을 요청 헤더에 추가
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
