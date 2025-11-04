import { Outlet } from "react-router-dom";
import Menu from "../Menu";
import MusicInfo from "../MusicInfo";
import PlayBar from "../PlayBar";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import NowPlayList from "../NowPlayList";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";

const Container = () => {
  //    Zustand state : playBar.tsx 관련 상태    //
  const { playBarModeState } = usePlaylistStore();
  const { playBarInOutlet, setPlayBarInOutlet } = usePlayerOptionStore();

  return (
    <>
      <div className={styles["warp"]}>
        <Menu />
        <div className={styles["content"]}>
          <Outlet />
        </div>

        {playBarModeState ? <NowPlayList /> : <MusicInfo />}
      </div>

      <div className={playBarInOutlet ? styles["playbar-container"] : ""}>
        <PlayBar />
      </div>
    </>
  );
};

export default Container;
