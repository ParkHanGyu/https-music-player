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
import useTokenExpiration from "./hooks/useTokenExpiration";

function App() {
  //          state: 쿠키 상태        //
  const [cookies, setCookie] = useCookies();
  //      Zustand state : 로그인 유저 정보 상태      //
  const { setLoginUserInfo, resetLoginUser } = useLoginUserStore();
  //      Zustand state : 로딩 상태      //
  const { setPlaylistLoading } = useVideoStore();
  //      useEffect : 토큰 변경시(만료, 생성) 엑세스 토큰에 대해서 재발급 또는 엑세스 토큰이 유효하지 않을 경우 유저 정보 초기화     //

  //      hook (커스텀) : 토큰 유효 시간   //
  const tokenExp = useTokenExpiration(cookies.accessToken);

  useEffect(() => {
    // setPlaylistLoading(true);

    // 토큰이 있으면 유저 정보를 set
    if (cookies.accessToken && tokenExp) {
      console.log("로그인 이후 유저 정보 set");
      getUserInfo(cookies.accessToken).then(getLoginUserResponse);

      // 만료시 -> 엑세스 토큰 재발급
    } else if (cookies.refreshToken && !tokenExp) {
      console.log("만료시 -> 엑세스 토큰 재발급");
      // 근데 리프레쉬 토큰이 있으면 -> 리프레쉬 토큰으로 재발급 요청
      console.log("리프레쉬 토큰으로 엑세스 토큰 재발급 요청");
      accessTokenReissue(cookies.refreshToken).then(accessTokenReissueResponse);

      // 리프레쉬 토큰이 없으면 -> 유저 정보 초기화
    } else if (!cookies.refreshToken) {
      console.log("리프레쉬 토큰이 없으면 -> 유저 정보 초기화");
      // 리프레쉬 토큰이 없으면
      resetLoginUser();
    }

    // setTimeout(() => {
    //   setPlaylistLoading(false);
    // }, 1000);
  }, [cookies.accessToken, tokenExp]);
  // 로그인 할때 유저정보 불러옴
  const getLoginUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) return;
    const { userDto } = responseBody as GetUserResponseDto;
    setLoginUserInfo(userDto);
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
