import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

// 토큰 유효성 검사 함수
const isValidJWT = (token: string | null) => {
  return token && token.split(".").length === 3;
};

// 커스텀 훅: useTokenExpiration
const useTokenExpiration = (token: string) => {
  const checkTokenExpiration = (token: string) => {
    if (!token || !isValidJWT(token)) {
      console.error("올바르지 않은 JWT 형식의 토큰입니다.");
      return false;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("유효하지 않은 토큰입니다.", error);
      return false;
    }
  };

  // 쿠키에서 accessToken을 받아와서 유효성 체크
  const isValid = checkTokenExpiration(token);

  return isValid;
};

export default useTokenExpiration;
