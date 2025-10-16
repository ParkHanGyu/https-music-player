import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import NowPlayList from "../NowPlayList";

const Container = () => {
  //    Zustand state : playBar.tsx 관련 상태    //
  const { nowPlayViewState } = usePlaylistStore();
  return (
    <>
      <div className={styles["warp"]}>
        <Menu />
        <Outlet />

        {nowPlayViewState ? <NowPlayList /> : <MusicInfo />}
      </div>
      <PlayBar />
    </>
  );
};

export default Container;
