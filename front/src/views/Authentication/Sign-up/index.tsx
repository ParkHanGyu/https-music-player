import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.css";
import SignUpRequestDto from "../../../apis/request/auth/sign-up-request.dto";
import { authNumberSend, signUpRequest } from "../../../apis";
import SignUpResponseDto from "../../../apis/response/auth/sign-up-response.dto";
import ResponseDto from "../../../apis/response/response.dto";
import { useNavigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../../../constant";
import { ResponseUtil } from "../../../utils";

const SignUp = () => {
  const navigator = useNavigate();

  // ========================================== 이메일
  //        state: 이메일 상태            //
  const [email, setEmail] = useState<string>("");
  //        state: 인증번호 readOnly 상태            //
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(false);
  // event handler: 이메일 변경 이벤트 처리     //
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  //        state:  email input, 발송 버튼 비활성화 상태            //
  const [emailInputBtnState, setEmailInputBtnState] = useState(false);

  //      event handler: 이메일 중복 확인 + 인증번호 발송 이벤트     //
  const onInputBtnCheckHandler = () => {
    alert("중복 체크 api 실행하기");

    // 이메일
    const hasEmail = email.trim().length !== 0;

    console.log(hasEmail);
    if (!hasEmail || !validateEmail(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setAuthDuplicateState(false);
    setIsReadOnly(false);

    authNumberSend(email).then(authNumberSendResponse);

    // api 호출

    // 중복이 아니라면 emailDuplicateState 값은 false, 중복이면 ture
    // setEmailDuplicateState(true);
    // setEmailDuplicateState(false);

    // emailDuplicateState가 ture면 alert으로 중복 메세지 띄워주기
    // emailDuplicateState가 false면 중복이 아니므로 이메일 인증번호를 발송하는 api 실행
  };

  //        function: authNumberSendResponse 처리 함수       //
  const authNumberSendResponse = (responseBody: ResponseDto | null) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    alert("인증번호를 발송했습니다.");
    setEmailInputBtnState(true);
    setIsEmailReadOnly(true);
  };

  // ========================================== 인증번호

  //        state: 인증번호 input, 확인 버튼 비활성화 상태            //
  const [authDuplicateState, setAuthDuplicateState] = useState(true);
  //        state: 인증번호 상태            //
  const [authNumber, setAuthNumber] = useState<string>("");
  //        state: 인증번호 readOnly 상태            //
  const [isReadOnly, setIsReadOnly] = useState(true);
  // event handler: 이메일 변경 이벤트 처리     //
  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
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

    signUpRequest(requestBody).then(signUpResponse);
  };

  //        function: sign up response 처리 함수       //
  const signUpResponse = (
    responseBody: SignUpResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    alert("회원가입 완료");
    navigator(SIGN_IN_PATH());
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
              <div className={styles["auth-email-box"]}>
                <input
                  type="text"
                  value={email}
                  readOnly={isEmailReadOnly}
                  onChange={onEmailChangeHandler}
                  className={`${styles["auth-input-style"]} ${
                    emailInputBtnState ? styles["input-look"] : ""
                  }`}
                />

                <div
                  className={
                    emailInputBtnState
                      ? `${styles["auth-text-box"]} ${styles["input-look"]}`
                      : styles["auth-text-box"]
                  }
                  onClick={
                    emailInputBtnState ? undefined : onInputBtnCheckHandler
                  }
                >
                  발송
                </div>
              </div>
            </div>

            <div className={styles["sign-up-auth"]}>
              인증번호
              <div className={styles["auth-box"]}>
                <input
                  type="text"
                  readOnly={isReadOnly}
                  value={authNumber}
                  onChange={onAuthNumberChangeHandler}
                  className={`${styles["auth-input-style"]} ${
                    authDuplicateState ? styles["input-look"] : ""
                  }`}
                />

                <div
                  className={
                    authDuplicateState
                      ? `${styles["auth-text-box"]} ${styles["input-look"]}`
                      : styles["auth-text-box"]
                  }
                  onClick={
                    authDuplicateState ? undefined : onInputBtnCheckHandler
                  }
                >
                  확인
                </div>
              </div>
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
