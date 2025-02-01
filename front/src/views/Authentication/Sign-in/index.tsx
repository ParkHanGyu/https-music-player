import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH, SIGN_UP_PATH } from "../../../constant";
import SignInRequestDto from "../../../apis/request/auth/sign-in-request.dto";
import { signInRequest } from "../../../apis";
import SignInResponseDto from "../../../apis/response/auth/sign-in.response.dto";
import ResponseDto from "../../../apis/response/response.dto";
import { useCookies } from "react-cookie";
import { ResponseUtil } from "../../../utils";

const SignIn = () => {
  const navigator = useNavigate();
  //          state: 쿠키 상태        //
  const [cookies, setCookie] = useCookies();

  // ======================== 이메일 =====================
  //      state: 이메일 상태        //
  const [email, setEmail] = useState<string>("");

  //      event handler: 이메일 변경 이벤트 처리 함수      //
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  // ======================== 비밀번호 =====================
  //      state: 패스워드 상태      //
  const [password, setPassword] = useState<string>("");
  //      event handler: 비밀번호 변경 이벤트 처리 함수      //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignUpClickHandler = () => {
    navigator(SIGN_UP_PATH());
  };

  //      event handler: 로그인 버튼 클릭 이벤트 처리 함수      //
  const onSignInBtnClickHandler = () => {
    const requestBody: SignInRequestDto = { email, password };
    signInRequest(requestBody).then(signInResponse);
  };

  //      function: sign in response 처리 함수    //
  const signInResponse = (
    responseBody: SignInResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    const {
      accessToken,
      refreshToken,
      accessTokenExpirationTime,
      refreshTokenExpirationTime,
    } = responseBody as SignInResponseDto;
    const now = new Date().getTime();
    const accessTokenExpires = new Date(now + accessTokenExpirationTime * 1000);
    const refreshTokenExpires = new Date(
      now + refreshTokenExpirationTime * 1000
    );

    // 유효시간 : 현재시간 + 백엔드에서 설정한 시간(60분) * 1000
    setCookie("accessToken", accessToken, {
      expires: accessTokenExpires,
      path: MAIN_PATH(),
    });
    setCookie("refreshToken", refreshToken, {
      expires: refreshTokenExpires,
      path: MAIN_PATH(),
    });
    // 'accessToken' : 이름, token 설정, path : 유효경로(MAIN_PATH() 이하의 모든 경로에서 유효함)

    navigator(MAIN_PATH());
  };

  //      event handler:  키보드 이벤트 핸들러       //
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      onSignInBtnClickHandler();
    }
  };
  return (
    <>
      <div className={styles["sign-in-wrap"]}>
        <div className={styles["sign-in-container"]}>
          <div className={styles["sign-in-container-top"]}>
            <div className={styles["sign-in-title"]}>SIGN IN</div>
          </div>
          <div className={styles["sign-in-container-mid"]}>
            <div className={styles["sign-in-email"]} onKeyDown={handleKeyDown}>
              email
              <input
                type="text"
                className={styles["input-style"]}
                onChange={onEmailChangeHandler}
              />
            </div>
            <div
              className={styles["sign-in-password"]}
              onKeyDown={handleKeyDown}
            >
              password
              <input
                type="password"
                className={styles["input-style"]}
                onChange={onPasswordChangeHandler}
              />
            </div>
          </div>
          <div className={styles["sign-in-container-bottom"]}>
            <div className={styles["sign-in-auth-options"]}>
              <div
                className={styles["options-sign-up-btn"]}
                onClick={onSignUpClickHandler}
              >
                회원가입
              </div>
              <div className={styles["options-find-password-btn"]}>
                비밀번호 찾기
              </div>
            </div>
            <div
              className={styles["sign-in-btn"]}
              onClick={onSignInBtnClickHandler}
            >
              로그인
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
