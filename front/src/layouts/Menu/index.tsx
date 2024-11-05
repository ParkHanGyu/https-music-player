import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH, PLAY_LIST_PATH } from "../../constant";
import Playlist from "../../types/interface/playList.interface";
import ResponseDto from "../../apis/response/response.dto";
import { useVideoStore } from "../../store/useVideoStore";

const Menu = () => {
  const { playlists } = useVideoStore();
  const navigator = useNavigate();

  const playListClickHandler = () => {
    setIsPlaylistDrop(!isPlaylistDrop);
  };

  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  //==========================================
  //==========================================
  //==========================================
  //==========================================

  const testValue = () => {
    console.log("서버에서 가져온 playLists값 : " + JSON.stringify(playlists));
  };

  const [isPlaylistDrop, setIsPlaylistDrop] = useState(false);

  const showPlaylistDetail = (playlistTitle: bigint) => {
    navigator(PLAY_LIST_PATH(playlistTitle));
  };

  return (
    <div className={styles["main-left"]}>
      <div className={styles["main-search-box"]}>
        <div className={styles["main-search-btn"]} onClick={testValue}></div>
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
                  onClick={() => showPlaylistDetail(playlist.playlistId)}
                >
                  {playlist.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles["main-menu-item3"]}>Youtube</div>
        <div className={styles["main-menu-item4"]}>SoundCloud</div>
      </div>
    </div>
  );
};

export default Menu;
