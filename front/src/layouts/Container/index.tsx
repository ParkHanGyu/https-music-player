import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import styles from "./style.module.css";

const Container = () => {
  return (
    <>
      <div>
        <div className={styles["warp"]}>
          <Menu />
          <Outlet />
          <MusicInfo />
        </div>
        <PlayBar />
      </div>
    </>
  );
};

export default Container;
