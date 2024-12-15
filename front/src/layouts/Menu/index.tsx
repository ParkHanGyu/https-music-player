import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MAIN_PATH,
  PLAY_LIST_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  TEST_PATH,
} from "../../constant";
import { useVideoStore } from "../../store/useVideo.store";
import useLoginUserStore from "../../store/login-user.store";
import { useCookies } from "react-cookie";
import { usePlaylistStore } from "../../store/usePlaylist.store";

const Menu = () => {
  const { playlistId } = useParams();
  const [cookies, removeCookie, deleteCookie] = useCookies();

  const { loginUser } = useLoginUserStore();

  const { playlistLibrary } = usePlaylistStore();
  const navigator = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const playListClickHandler = () => {
    setIsPlaylistDrop(!isPlaylistDrop);
  };

  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  //==========================================

  const testValue = () => {
    navigator(TEST_PATH());
    // alert("셋팅된 loginUser 값 : " + JSON.stringify(loginUser));
  };

  useEffect(() => {
    if (currentPath.includes("play-list")) {
      setIsPlaylistDrop(true);
    } else {
      setIsPlaylistDrop(false);
    }
  }, [currentPath]);

  const [isPlaylistDrop, setIsPlaylistDrop] = useState(false);

  const showPlaylistDetail = (playlistId: bigint, event: React.MouseEvent) => {
    event.stopPropagation();
    if (currentPath !== `/play-list/${playlistId}`) {
      navigator(PLAY_LIST_PATH(playlistId));
    }
    return;
  };

  const onYoutubeUrl = (pageName: string) => {
    if (pageName === "youtube") {
      window.open(`https://www.${pageName}.com`);
    }
    if (pageName === "soundcloud") {
      window.open(`https://www.${pageName}.com`);
    }
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignInClickHandler = () => {
    navigator(SIGN_IN_PATH());
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignUpClickHandler = () => {
    navigator(SIGN_UP_PATH());
  };

  const onSignOutBtnClickHandler = () => {
    if (cookies.accessToken) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      alert("로그아웃 되었습니다.");
      navigator(MAIN_PATH());
    }
  };

  const onImageModifyHandler = () => {
    console.log("loginUser 값 : ", loginUser);
  };

  return (
    <div className={styles["menu-container"]}>
      {loginUser ? (
        <div className={styles["menu-user-info-box"]}>
          <div
            className={styles["menu-user-info-image"]}
            style={
              loginUser && loginUser.profileImage
                ? { backgroundImage: `url(${loginUser.profileImage})` }
                : {}
            }
            onClick={onImageModifyHandler}
          ></div>

          <div className={styles["menu-user-info-email"]}>
            {loginUser?.email}
          </div>
          <div
            className={styles["menu-user-info-logout-btn"]}
            onClick={onSignOutBtnClickHandler}
          ></div>
        </div>
      ) : (
        <div className={styles["menu-sign-box"]}>
          <div
            className={styles["menu-user-sign-in-btn"]}
            onClick={onSignInClickHandler}
          >
            SIGN IN
          </div>
          <div
            className={styles["menu-user-sign-up-btn"]}
            onClick={onSignUpClickHandler}
          >
            SIGN UP
          </div>
        </div>
      )}

      <div className={styles["main-menu-box"]}>
        <div className={styles["main-menu-item1"]} onClick={homeClickHandler}>
          Home
        </div>
        <div
          className={styles["main-menu-item2"]}
          onClick={playListClickHandler}
        >
          <p>PlayList</p>
          {isPlaylistDrop && (
            <ul style={{ margin: !playlistLibrary.length ? "0px" : undefined }}>
              {playlistLibrary.map((playlist, index) => (
                <li
                  style={{
                    backgroundColor:
                      playlistId === (index + 1).toString()
                        ? "#333333"
                        : undefined,

                    color:
                      playlistId === (index + 1).toString()
                        ? "#ffffff"
                        : undefined,
                  }}
                  key={index}
                  onClick={(
                    event: React.MouseEvent<HTMLLIElement, MouseEvent>
                  ) => showPlaylistDetail(playlist.playlistId, event)}
                >
                  {playlist.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={styles["main-menu-item3"]}
          onClick={() => onYoutubeUrl("youtube")}
        >
          Youtube
        </div>
        <div
          className={styles["main-menu-item4"]}
          onClick={() => onYoutubeUrl("soundcloud")}
        >
          SoundCloud
        </div>

        <div className={styles["main-menu-item5"]} onClick={testValue}>
          TEST
        </div>
      </div>
    </div>
  );
};

export default Menu;
