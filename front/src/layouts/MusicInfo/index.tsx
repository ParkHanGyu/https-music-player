import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideoStore";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import { YoutubeInfo } from "../../types/interface/youtube.interface";

const noEmbed = "https://noembed.com/embed?url=";
const urlForm = "https://www.youtube.com/watch?v=";
const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjb6DRcr48cY8lS0pYoQ4JjiEyrFlxWvWsw&s"; // 기본 이미지 URL

const MusicInfo = () => {
  const { isPlaying, setIsPlaying, urlId, setPlayUrl, setPlayBarInfo } =
    useVideoStore();
  const formatTime = useFormatTime();

  useEffect(() => {
    if (urlId) {
      onSubmit(urlId);
    }
  }, [urlId]);

  const [youtube, setYoutube] = useState<YoutubeInfo>({
    // info 초기값
    vid_url: "-",
    author: "-",
    thumb: defaultImage, // 기본 이미지 설정
    vid_title: "-",
  });

  const onSubmit = (urlId: string) => {
    if (urlId) {
      getInfo(urlId);
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
      vid_url: url || null,
      author: author_name || null,
      thumb: thumbnail_url || null,
      vid_title: title || null,
    });
  };

  // 재생버튼
  const playHandleClick = () => {
    setPlayUrl(urlId);
    setIsPlaying(true);
    // youtube데이터를 useVideoStore에 셋팅
    setPlayBarInfo(youtube);
  };

  // url 시간 상태
  const [infoDuration, setInfoDuration] = useState<number>(0);

  // url 시간 셋팅
  const handleDuration = (infoDuration: number) => {
    setInfoDuration(infoDuration);
  };

  // ===========재생목록 관련
  // 재생 목록 데이터 (예시)
  const mockPlaylists = ["My Favorites", "Top Hits", "Chill Vibes"];
  // 재생목록 팝업 상태
  const [isPlaylistPopupOpen, setPlaylistPopupOpen] = useState(false);
  const togglePlaylistPopup = () => {
    setPlaylistPopupOpen(!isPlaylistPopupOpen);
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
              {formatTime(infoDuration)}
            </div>
          </div>
        </div>

        <div className={styles["music-info-controller"]}>
          <div
            className={styles["info-controller-play-btn"]}
            onClick={playHandleClick}
          ></div>

          <div
            className={styles["controller-add-playlist"]}
            onClick={togglePlaylistPopup}
          ></div>
        </div>
      </div>
      <ReactPlayer
        url={`youtu.be/${urlId}`}
        playing={false}
        onDuration={handleDuration}
        style={{ display: "none" }} // 완전히 숨김 처리
      />

      {/* =======================================재생목록 팝업 */}
      {isPlaylistPopupOpen && (
        <div className={styles["playlist-popup"]}>
          <div className={styles["playlist-popup-content"]}>
            <div className={styles["playlist-popup-left"]}>
              <h3>Select Playlist</h3>
              <ul>
                {mockPlaylists.map((playlist, index) => (
                  <li
                    key={index}
                    onClick={() => console.log(`Added to ${playlist}`)}
                  >
                    {playlist}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles["playlist-popup-right"]}>
              <div
                className={styles["playlist-popup-close"]}
                onClick={togglePlaylistPopup}
              ></div>

              <div className={styles["playlist-popup-add"]}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicInfo;
