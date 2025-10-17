import { useVideoStore } from "../../store/useVideo.store";
import styles from "./style.module.css";

const NowPlay = () => {
  const { playBarInfo, setPlayBarInfo } = useVideoStore();

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
