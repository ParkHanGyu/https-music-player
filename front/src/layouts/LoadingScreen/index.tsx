import styles from "./style.module.css";

interface LoadingScreenProps {
  loadingType?: string;
}

const LoadingScreen = ({ loadingType }: LoadingScreenProps) => {
  return (
    <div
      className={
        loadingType === "musicInfo"
          ? styles["musicInfo-loading-overlay"]
          : loadingType === "playBar"
          ? styles["playBar-loading-overlay"]
          : ""
      }
    >
      <div className={styles["loading-spinner"]}></div>
    </div>
  );
};

export default LoadingScreen;
