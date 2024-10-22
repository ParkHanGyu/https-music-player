import styles from "./style.module.css";

const MusicInfo = () => {
  return (
    <div className={styles["main-left"]}>
      <div className={styles["music-info-title"]}>Search Music</div>
      <div className={styles["music-info-image"]}></div>
      <div className={styles["music-info-data"]}>
        <div className={styles["music-info-artist-box"]}>
          <div className={styles["artist-info"]}>Artist</div>
          <div className={styles["artist-data"]}>Infraction, Emerel </div>
        </div>
        <div className={styles["music-info-genre-box"]}>
          <div className={styles["genre-info"]}>Genre</div>
          <div className={styles["genre-data"]}>Electronic</div>
        </div>
        <div className={styles["music-info-album-box"]}>
          <div className={styles["album-info"]}>Album</div>
          <div className={styles["album-data"]}>Royalty Free</div>
        </div>
      </div>
    </div>
  );
};

export default MusicInfo;
