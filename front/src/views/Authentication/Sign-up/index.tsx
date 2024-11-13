import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.css";
import SignUpRequestDto from "../../../apis/request/auth/sign-up-request.dto";
import { signUpRequest } from "../../../apis";
import SignUpResponseDto from "../../../apis/response/auth/sign-up-response.dto";
import ResponseDto from "../../../apis/response/response.dto";

const SignUp = () => {
  // ========================================== 이메일
  //        state: 이메일 상태            //
  const [email, setEmail] = useState<string>("");
  // event handler: 이메일 변경 이벤트 처리     //
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  // ========================================== 비밀번호

  //        state: 패스워드 상태          //
  const [password, setPassword] = useState<string>("");
  // event handler: 패스워드 변경 이벤트 처리     //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  // ========================================== 비밀번호 확인
  //        state: 패스워드 확인 상태          //
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  // event handler: 패스워드 확인 변경 이벤트 처리     //
  const onPasswordCheckChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPasswordCheck(value);
  };

  // ==========================================

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSignUpBtnClickHandler = () => {
    if (!validateEmail(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 이메일
    const hasEmail = email.trim().length !== 0;

    // 패스워드
    const hasPassword = password.trim().length !== 0;

    const hasPasswordCheck = passwordCheck.trim().length !== 0;

    if (!hasEmail) {
      alert("이메일을 입력해주세요");
      return;
    }

    if (!hasPassword) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    if (!hasPasswordCheck) {
      alert("비밀번호 확인을 입력해주세요");
      return;
    }

    if (passwordCheck !== password) {
      alert("비밀번호 불일치");
      return;
    }

    const requestBody: SignUpRequestDto = {
      email: email,
      password: password,
      profileImage: "",
    };

    console.log("api요청할 requestBody 값 : " + JSON.stringify(requestBody));

    signUpRequest(requestBody).then(signUpResponse);
  };

  //        function: sign up response 처리 함수       //
  const signUpResponse = (
    responseBody: SignUpResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("네트워크 이상입니다.");
      return;
    }

    console.log("서버에서 반환해준 데이터 : " + JSON.stringify(responseBody));
    // const { code } = responseBody;
    // if (code === "DE") {
    //   setEmailError(true);
    //   setEmailErrorMessage("이미 존재하는 이메일 주소입니다.");
    // }
    // if (code === "DN") {
    //   setNicknameError(true);
    //   setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
    // }
    // if (code === "VF") alert("모든 값을 입력하세요.");
    // if (code === "DBE") alert("데이터베이스 오류입니다.");
    // if (code !== "SU") return;
    // navigate(SIGN_IN_PATH());
  };
  return (
    <>
      <div className={styles["sign-up-wrap"]}>
        <div className={styles["sign-up-container"]}>
          <div className={styles["sign-up-container-top"]}>
            <div className={styles["sign-up-title"]}>SIGN UP</div>
          </div>
          <div className={styles["sign-up-container-mid"]}>
            <div className={styles["sign-up-email"]}>
              email
              <input
                type="text"
                value={email}
                onChange={onEmailChangeHandler}
                className={styles["input-style"]}
              />
            </div>
            <div className={styles["sign-up-password"]}>
              password
              <input
                type="password"
                value={password}
                onChange={onPasswordChangeHandler}
                className={styles["input-style"]}
              />
            </div>
            <div className={styles["sign-up-password-check"]}>
              password-check
              <input
                type="password"
                value={passwordCheck}
                onChange={onPasswordCheckChangeHandler}
                className={styles["input-style"]}
              />
            </div>
          </div>
          <div className={styles["sign-up-container-bottom"]}>
            <div
              className={styles["sign-up-btn"]}
              onClick={onSignUpBtnClickHandler}
            >
              회원가입
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
