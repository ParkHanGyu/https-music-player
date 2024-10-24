import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { url } from "inspector";

interface YoutubeInfo {
  id: string | null;
  vid_url: string | null;
  author: string | null;
  thumb: string | null;
  vid_title: string | null;
}

interface MusicInfoProps {
  videoUrl: string; // videoUrl 타입 정의
  duration: number;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>; // 상태 변경 함수
  setMatchVideoUrl: React.Dispatch<React.SetStateAction<string>>;
}

const noEmbed = "https://noembed.com/embed?url=";
const urlForm = "https://www.youtube.com/watch?v=";
const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjb6DRcr48cY8lS0pYoQ4JjiEyrFlxWvWsw&s"; // 기본 이미지 URL

const MusicInfo: React.FC<MusicInfoProps> = ({
  videoUrl,
  duration,
  setIsPlaying,
  setMatchVideoUrl,
}) => {
  useEffect(() => {
    setInputValue(videoUrl);
    onSubmit(videoUrl);
  }, [videoUrl]);

  const [youtube, setYoutube] = useState<YoutubeInfo>({
    id: "-",
    vid_url: "-",
    author: "-",
    thumb: defaultImage, // 기본 이미지 설정
    vid_title: "-",
  });
  const [inputValue, setInputValue] = useState<string>("");

  const onSubmit = (videoUrl: string) => {
    if (videoUrl) {
      getInfo(videoUrl);
    }
  };

  const getInfo = (id: string) => {
    const fullUrl = noEmbed + urlForm + id;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
        console.log(data);
      });
  };

  const setInfo = (data: any) => {
    const { url, author_name, thumbnail_url, title } = data;
    setYoutube({
      id: inputValue,
      vid_url: url || null,
      author: author_name || null,
      thumb: thumbnail_url || null,
      vid_title: title || null,
    });
  };

  // 시간 계산
  const formatTime = (time: number) => {
    if (isNaN(time)) {
      return;
    }
    const date = new Date(time * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  function pad(number: number) {
    return ("0" + number).slice(-2);
  }

  const playHandleClick = () => {
    setIsPlaying(true); // 상태를 반전시킴
    setMatchVideoUrl(`youtu.be/${videoUrl}`);
  };

  return (
    <>
      <div className={styles["main-left"]}>
        <div className={styles["music-info"]}>Search Music</div>
        <div
          className={styles["music-info-image"]}
          style={{
            backgroundImage: `url(${youtube.thumb})`,
          }}
        ></div>
        <div className={styles["music-info-data"]}>
          <div className={styles["music-info-title-box"]}>
            <div className={styles["title-info"]}>Title</div>
            <div className={styles["title-data"]}>{youtube.vid_title}</div>
          </div>
          <div className={styles["music-info-artist-box"]}>
            <div className={styles["artist-info"]}>Artist</div>
            <div className={styles["artist-data"]}>{youtube.author}</div>
          </div>
          <div className={styles["music-info-genre-box"]}>
            <div className={styles["genre-info"]}>Genre</div>
            <div className={styles["genre-data"]}>-</div>
          </div>

          <div className={styles["music-info-album-box"]}>
            <div className={styles["album-info"]}>Album</div>
            <div className={styles["album-data"]}>-</div>
          </div>

          <div className={styles["music-info-playtime"]}>
            <div className={styles["playtime-info"]}>Playtime</div>
            <div className={styles["playtime-data"]}>
              {formatTime(duration)}
            </div>
          </div>
        </div>

        <div className={styles["music-info-controller"]}>
          <div
            className={styles["info-controller-play-btn"]}
            onClick={playHandleClick}
          ></div>

          {/* <div
                  className={
                    isPlaying
                      ? styles["info-controller-pause-btn"]
                      : styles["info-controller-play-btn"]
                  }
                  onClick={handlePlayPause}
                ></div> */}

          <div className={styles["controller-add-playlist"]}></div>
        </div>
      </div>
    </>
  );
};

export default MusicInfo;
