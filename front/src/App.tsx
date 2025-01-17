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
import { getUserInfo, refreshAccessToken } from "./apis";
import { useVideoStore } from "./store/useVideo.store";
import TestView2 from "./views/TestView2";

function App() {
  const [cookies] = useCookies();
  const { setLoginUserInfo, resetLoginUser } = useLoginUserStore();
  const { setIsLoading } = useVideoStore();

  useEffect(() => {
    if (!cookies.accessToken) {
      // 리프레쉬 토큰으로 재발급 요청
      refreshAccessToken(cookies.refreshToken);

      //
      resetLoginUser();

      setTimeout(() => {
        setIsLoading(false); // 로그인 정보 없으면 1초 뒤 로딩 상태 끝내기
      }, 1000);
      return;
    }
    getUserInfo(cookies.accessToken).then(getLoginUserResponse);
  }, [cookies.accessToken]);
  const getLoginUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) return;
    const { userDto } = responseBody as GetUserResponseDto;
    setLoginUserInfo(userDto);
    setTimeout(() => {
      setIsLoading(false); // 로그인 정보 없으면 1초 뒤 로딩 상태 끝내기
    }, 1000);
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
