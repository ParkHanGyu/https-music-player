import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import { getPlayListLibraryReqeust } from "../../apis";
import GetPlayListResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import ResponseDto from "../../apis/response/response.dto";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useLoginUserStore from "../../store/login-user.store";
import { SIGN_IN_PATH } from "../../constant";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import PlaylistLibrary from "../PlaylistLibrary";
import useMediaInfo from "../../hooks/testInfo";

const MusicInfo = () => {
  const { urlId, setUrlId, setPlayBarUrl, setPlayBarInfo } = useVideoStore();

  const { setPlaylistLibrary } = usePlaylistStore();

  const { isPlaying, setIsPlaying } = usePlayerOptionStore();

  const [cookies] = useCookies();
  const formatTime = useFormatTime();
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();

  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjb6DRcr48cY8lS0pYoQ4JjiEyrFlxWvWsw&s"; // 기본 이미지 URL
  // 커스텀 훅 사용
  const { infoData, setMusicInfo, resetYoutubeInfo } =
    useYoutubeInfo(defaultImage);

  const {
    testInfoData,
    setTestInfoData,
    setMediaInfo,
    testImage,
    resetMediaInfo,
  } = useMediaInfo(defaultImage);

  // useEffect(() => {
  //   if (urlId) {
  //     setMusicInfo(urlId);
  //   }
  // }, [urlId]);

  useEffect(() => {
    if (urlId) {
      setMediaInfo(urlId);
    }
  }, [urlId]);

  // 정보 초기화
  const resetInfo = () => {
    resetYoutubeInfo();
    setInfoDuration(0);
  };

  // 재생버튼
  const playHandleClick = () => {
    if (isInfoError) {
      alert("error");
      return;
    }

    if (!urlId) {
      alert("음악 검색 후 시도 해주셈");
      return;
    }
    setPlayBarUrl(urlId);
    if (!isPlaying) {
      setIsPlaying(!isPlaying);
    }
    // youtube데이터를 useVideoStore에 셋팅
    setPlayBarInfo(testInfoData);
  };

  // url 시간 상태
  const [infoDuration, setInfoDuration] = useState<number>(0);

  // url 시간 셋팅
  const handleDuration = (infoDuration: number) => {
    setInfoDuration(infoDuration);
  };

  // ===========재생목록 관련

  // 재생목록 팝업 상태
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);
  const togglePlaylistPopup = () => {
    if (!loginUser) {
      alert("로그인 이후 추가해주세요.");
      navigator(SIGN_IN_PATH());
      return;
    }
    if (!urlId) {
      alert("음악 검색 후 시도 해주셈");
      return;
    }
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  // =========== 재생목록 셋팅 ===============================
  useEffect(() => {
    if (!cookies.accessToken) {
      setPlaylistLibrary([]);
      return;
    }
    if (cookies.accessToken) {
      getPlayListLibraryReqeust(cookies.accessToken).then(
        getPlaylistLibraryResponse
      );
    }
  }, [cookies.accessToken]);

  const getPlaylistLibraryResponse = (
    responseBody: GetPlayListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }

    const playListResult = responseBody as GetPlayListResponseDto;

    setPlaylistLibrary(playListResult.playListLibrary);
  };

  // ==========================
  // info페이지 에러 상태
  const [isInfoError, setIsInfoError] = useState<boolean>(false);

  const testBtn = () => {
    console.log("urlId 값 : ", JSON.stringify(urlId));

    console.log("testInfoData 값 : ", JSON.stringify(testInfoData));
  };

  return (
    <>
      <div className={styles["main-left"]}>
        <div className={styles["music-info"]} onClick={() => testBtn()}>
          Search Music
        </div>
        <div
          className={styles["music-info-image"]}
          style={{
            backgroundImage: `url(${testInfoData.thumb})`,
          }}
        ></div>
        <div className={styles["music-info-data"]}>
          <div className={styles["music-info-title-box"]}>
            <div className={styles["title-info"]}>Title</div>
            <div className={styles["title-data"]}>{testInfoData.vidTitle}</div>
          </div>
          <div className={styles["music-info-artist-box"]}>
            <div className={styles["artist-info"]}>Artist</div>
            <div className={styles["artist-data"]}>{testInfoData.author}</div>
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
      {urlId && (
        <ReactPlayer
          url={urlId}
          playing={false}
          onDuration={handleDuration}
          style={{ display: "none" }} // 완전히 숨김 처리
          onError={(e) => {
            alert(
              "동영상 소유자가 외부 재생을 제한했습니다. YouTube에서 직접 시청해주세요."
            );
            resetInfo();
            setIsInfoError(true);
            setUrlId("");
          }}
          onReady={() => {
            setIsInfoError(false);
          }}
        />
      )}

      {/* =======================================재생목록 팝업 */}
      {playlistPopupOpen && (
        <PlaylistLibrary
          infoData={testInfoData}
          infoDuration={infoDuration}
          playlistPopupOpen={playlistPopupOpen}
          setPlaylistPopupOpen={setPlaylistPopupOpen}
        />
      )}
    </>
  );
};

export default MusicInfo;
