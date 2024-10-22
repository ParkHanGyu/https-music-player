import React from "react";
import styles from "./style.module.css";

const Menu = () => {
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
        <div className={styles["main-menu-item1"]}>All Tracks</div>
        <div className={styles["main-menu-item2"]}>PlayList</div>
        <div className={styles["main-menu-item3"]}>Youtube</div>
        <div className={styles["main-menu-item4"]}>SoundCloud</div>
      </div>
    </div>
  );
};

export default Menu;
