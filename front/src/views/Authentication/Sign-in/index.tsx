import React from "react";
import styles from "./style.module.css";

const SignIn = () => {
  return (
    <>
      <div className={styles["sign-in-wrap"]}>
        <div className={styles["sign-in-container"]}>
          <div className={styles["sign-in-container-top"]}>
            <div className={styles["sign-in-title"]}>SIGN IN</div>
          </div>
          <div className={styles["sign-in-container-mid"]}>
            <div className={styles["sign-in-email"]}>
              email
              <input type="text" className={styles["input-style"]} />
            </div>
            <div className={styles["sign-in-password"]}>
              password
              <input type="password" className={styles["input-style"]} />
            </div>
          </div>
          <div className={styles["sign-in-container-bottom"]}>
            <div className={styles["sign-in-auth-options"]}>
              <div className={styles["options-sign-up-btn"]}>회원가입</div>
              <div className={styles["options-find-password-btn"]}>
                비밀번호 찾기
              </div>
            </div>
            <div className={styles["sign-in-btn"]}>로그인</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
