import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "./layouts/Container";
import {
  MAIN_PATH,
  PLAY_LIST_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
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
import { getUserInfo } from "./apis";

function App() {
  const [cookies, setCookies] = useCookies();
  const { setLoginUser, resetLoginUser } = useLoginUserStore();

  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getUserInfo(cookies.accessToken).then(getLoginUserResponse);
  }, [cookies.accessToken]);
  const getLoginUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    ResponseUtil(responseBody);
    if (!responseBody) return;
    const { userDto } = responseBody as GetUserResponseDto;
    setLoginUser(userDto);
  };

  return (
    <Router>
      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={SIGN_IN_PATH()} element={<SignIn />} />
          <Route path={SIGN_UP_PATH()} element={<SignUp />} />
          <Route path={PLAY_LIST_PATH(":playlistId")} element={<PlayList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
