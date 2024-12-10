import styles from "./style.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles["loading-overlay"]}>
      <div className={styles["loading-spinner"]}></div>
    </div>
  );
};

export default LoadingScreen;
