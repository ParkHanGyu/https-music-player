import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "./layouts/Container";
import {
  MAIN_PATH,
  PLAY_LIST_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  TEST_PATH,
} from "./constant";
import PlayList from "./views/PlayList";
import Main from "./views/Main";
import SignIn from "./views/Authentication/Sign-in";
import SignUp from "./views/Authentication/Sign-up";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import useLoginUserStore from "./store/login-user.store";
import GetUserResponseDto from "./apis/response/user/get-user-info-response.dto";
import ResponseDto from "./apis/response/response.dto";
import { ResponseUtil } from "./utils";
import { accessTokenReissue, getUserInfo } from "./apis";
import { useVideoStore } from "./store/useVideo.store";
import TestView2 from "./views/TestView2";
import accessTokenReissueResponseDto from "./apis/response/auth/accessTokenReissue.response.dto";

function App() {
  const [cookies, setCookie] = useCookies();
  const { setLoginUserInfo, resetLoginUser } = useLoginUserStore();
  const { setIsLoading } = useVideoStore();
  //          state: 쿠키 상태        //

  useEffect(() => {
    if (!cookies.accessToken) {
      // 쿠키가 없으면 유저 정보를 reset
      if (cookies.refreshToken) {
        // 근데 리프레쉬 토큰이 있으면
        // 리프레쉬 토큰으로 재발급 요청
        console.log("리프레쉬 토큰으로 엑세스 토큰 재발급 요청");
        accessTokenReissue(cookies.refreshToken).then(
          accessTokenReissueResponse
        );
      } else {
        // 리프레쉬 토큰이 없으면
        resetLoginUser();

        setTimeout(() => {
          setIsLoading(false); // 로그인 정보 없으면 1초 뒤 로딩 상태 끝내기
        }, 1000);
      }

      return;
    } else {
      // 토큰이 있으면 유저 정보를 set
      getUserInfo(cookies.accessToken).then(getLoginUserResponse);
    }
  }, [cookies.accessToken]);
  const getLoginUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) return;
    const { userDto } = responseBody as GetUserResponseDto;
    setLoginUserInfo(userDto);
    setTimeout(() => {
      setIsLoading(false); // 1초 뒤 로딩 상태 끝내기
    }, 1000);
  };

  //      function: accessTokenReissueResponse 처리 함수    //
  const accessTokenReissueResponse = (
    responseBody: accessTokenReissueResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    const { accessToken, accessTokenExpirationTime } =
      responseBody as accessTokenReissueResponseDto;
    const now = new Date().getTime();
    const accessTokenExpires = new Date(now + accessTokenExpirationTime * 1000);
    console.log("accessTokenExpirationTime : ", accessTokenExpirationTime);
    console.log("accessTokenExpires : ", accessTokenExpires);
    // 유효시간 : 현재시간 + 백엔드에서 설정한 시간(60분) * 1000
    setCookie("accessToken", accessToken, {
      expires: accessTokenExpires,
      path: MAIN_PATH(),
    });
    // 'accessToken' : 이름, token 설정, path : 유효경로(MAIN_PATH() 이하의 모든 경로에서 유효함)
  };

  return (
    <Router>
      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={SIGN_IN_PATH()} element={<SignIn />} />
          <Route path={SIGN_UP_PATH()} element={<SignUp />} />
          <Route path={PLAY_LIST_PATH(":playlistId")} element={<PlayList />} />
          <Route path={TEST_PATH()} element={<TestView2 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
