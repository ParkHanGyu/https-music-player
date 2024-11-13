import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MAIN_PATH,
  PLAY_LIST_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from "../../constant";
import { useVideoStore } from "../../store/useVideoStore";

const Menu = () => {
  const { playlists } = useVideoStore();
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
    alert("isPlaylistDrop 값 : " + isPlaylistDrop);
    alert("currentPath 값 : " + currentPath);
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

  return (
    <div className={styles["menu-container"]}>
      <div className={styles["menu-user-info-box"]}>
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

      <div className={styles["main-menu-box"]}>
        <div className={styles["main-menu-item1"]} onClick={homeClickHandler}>
          Home
        </div>
        <div
          className={styles["main-menu-item2"]}
          onClick={playListClickHandler}
        >
          PlayList
          {isPlaylistDrop && (
            <ul>
              {playlists.map((playlist, index) => (
                <li
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
      </div>
    </div>
  );
};

export default Menu;
