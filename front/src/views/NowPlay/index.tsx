import { useEffect } from "react";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { useVideoStore } from "../../store/useVideo.store";
import styles from "./style.module.css";

const NowPlay = () => {
  const { playBarInfo, setPlayBarInfo } = useVideoStore();
  //    Zustand state : PlayBar 재생 상태    //
  const { playBarInOutlet, setPlayBarInOutlet } = usePlayerOptionStore();
  useEffect(() => {
    if (!playBarInOutlet) {
      setPlayBarInOutlet(true);
    }
  }, []);

  return (
    <div className={styles["main-wrap"]}>
      <div
        className={styles["background-music-image"]}
        style={{
          backgroundImage: `url(${playBarInfo?.musicInfo.imageUrl})`,
        }}
      ></div>
    </div>
  );
};

export default NowPlay;
