import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import styles from "./style.module.css";
import NowPlay from "../NowPlay";
import { usePlaylistStore } from "../../store/usePlaylist.store";

const Container = () => {
  //    Zustand state : playBar.tsx 관련 상태    //
  const { nowPlayViewState } = usePlaylistStore();
  return (
    <>
      <div className={styles["warp"]}>
        <Menu />
        <Outlet />

        {nowPlayViewState ? <NowPlay /> : <MusicInfo />}
      </div>
      <PlayBar />
    </>
  );
};

export default Container;
