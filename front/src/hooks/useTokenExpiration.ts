import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// JWT 유효성 검사 함수
const isValidJWT = (token: string | null) => {
  return token && token.split(".").length === 3;
};

// 커스텀 훅: useTokenExpiration
const useTokenExpiration = (token: string) => {
  const [isValid, setIsValid] = useState(true); // 상태를 useState로 관리

  useEffect(() => {
    if (!token || !isValidJWT(token)) {
      console.error("올바르지 않은 JWT 형식의 토큰입니다.");
      setIsValid(false); // 유효하지 않으면 false로 상태 변경
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - currentTime; // 만료까지 남은 시간(초)

      if (expiresIn <= 0) {
        setIsValid(false); // 만료되었으면 false
      } else {
        setIsValid(true); // 만료 시간이 남아있으면 true
      }

      // 만료 시간이 다가오면 자동으로 만료 처리
      const timeout = setTimeout(() => {
        setIsValid(false); // 일정 시간이 지나면 만료 처리
      }, expiresIn * 1000);

      return () => clearTimeout(timeout); // cleanup 함수로 timeout 정리
    } catch (error) {
      console.error("유효하지 않은 토큰입니다.", error);
      setIsValid(false); // 예외 발생시 false
      return () => false;
    }
  }, [token]); // token이 변경될 때마다 실행

  return isValid;
};

export default useTokenExpiration;
