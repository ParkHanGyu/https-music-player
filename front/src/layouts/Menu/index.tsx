import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH, PLAY_LIST_PATH } from "../../constant";
import { getPlayListReqeust } from "../../apis";
import PlayList from "../../types/interface/playList.interface";
import ResponseDto from "../../apis/response/response.dto";
import GetPlayListResponseDto from "../../apis/response/PlayList/PlayList.dto";

const Menu = () => {
  const navigator = useNavigate();

  const playListClickHandler = () => {
    navigator(PLAY_LIST_PATH());
  };

  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  //==========================================
  //==========================================
  //==========================================
  //==========================================
  useEffect(() => {
    const userName = "bob";
    getPlayListReqeust(userName).then(getPlayListResponse);
  }, []);

  const getPlayListResponse = (
    responseBody: GetPlayListResponseDto | ResponseDto | null
  ) => {
    console.log(responseBody);

    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    if (responseBody) {
      // setPlayLists(responseBody);
      return;
    }
  };

  const [playLists, setPlayLists] = useState<PlayList[]>([]);

  return (
    <div className={styles["main-left"]}>
      <div className={styles["main-search-box"]}>
        <input
          className={styles["main-search-input"]}
          type="text"
          placeholder="YouTube URL 입력"
        />
        <div className={styles["main-search-btn"]}></div>
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
          <div></div>
        </div>
        <div className={styles["main-menu-item3"]}>Youtube</div>
        <div className={styles["main-menu-item4"]}>SoundCloud</div>
      </div>
    </div>
  );
};

export default Menu;
