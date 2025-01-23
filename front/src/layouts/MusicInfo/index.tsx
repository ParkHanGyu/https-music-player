import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import { getPlayListLibraryReqeust } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useLoginUserStore from "../../store/login-user.store";
import { SIGN_IN_PATH } from "../../constant";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import PlaylistLibrary from "../PlaylistLibrary";
import useMediaInfo from "../../hooks/useMediaInfo";
import LoadingScreen from "../LoadingScreen";
import { ResponseUtil } from "../../utils";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";

const MusicInfo = () => {
  const { searchUrl, setSearchUrl, playBarUrl, setPlayBarUrl, setPlayBarInfo } =
    useVideoStore();

  //    Zustand state : playBar.tsx 관련 상태    //
  const {
    setPlaylistLibrary,
    setNowRandomPlaylist,
    setNowPlayingPlaylist,
    setNowPlayingPlaylistID,
    setNowRandomPlaylistID,
  } = usePlaylistStore();

  //    Zustand state : playBar.tsx 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();

  const [cookies] = useCookies();
  const formatTime = useFormatTime();
  const navigator = useNavigate();
  //    Zustand state :유저 정보 상태    //
  const { loginUserInfo } = useLoginUserStore();

  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjb6DRcr48cY8lS0pYoQ4JjiEyrFlxWvWsw&s"; // 기본 이미지 URL

  //    hook (커스텀) : 음악 정보들 set    //
  const { infoData, setMusicInfo, resetInfoData } = useMediaInfo(defaultImage);

  //      state:  로딩 상태        //
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //      useEffect : main.tsx에서 검색한 url을 useMediaInfo에 set     //
  useEffect(() => {
    // 메인에서 검색한 url이 youtube 또는 soundcloud이 포함되어 있는지 확인
    if (
      searchUrl.includes("youtube") ||
      searchUrl.includes("youtu.be") ||
      searchUrl.includes("soundcloud")
    ) {
      console.log("musicInfo.tsx 51줄 useEffect 실행 -> if 문 true");

      // 포함되어 있다면 MusicInfo 컴포넌트에 사용할 데이터 set
      setIsLoading(true);
      setMusicInfo(searchUrl);
    } else {
      return;
    }
  }, [searchUrl]);

  //      event handler: 링크 클릭 이벤트 처리 함수       //
  const handleOpenVideo = () => {
    if (infoData.vidUrl !== "-") {
      window.open(`${infoData.vidUrl}`, "_blank");
    }
    return;
  };

  //      event handler: 재생 버튼 클릭 이벤트 처리 함수       //
  const playHandleClick = () => {
    if (isInfoError) {
      alert("error");
      return;
    }

    if (!searchUrl) {
      alert("음악 검색 후 시도 해주셈");
      return;
    }

    // 다른 재생목록의 같은 노래일 경우 같은 노래를 틀어야 하니 빈문자열로 set
    if (playBarUrl) {
      setPlayBarUrl("");
    }

    setTimeout(() => {
      setPlayBarUrl(searchUrl);
      // youtube데이터를 useVideoStore에 셋팅
      setPlayBarInfo(infoData);
      // 비회원도 가능한 기능이기 때문에 현재 노래를 제외한 노래재생목록을 비워주기
      setNowRandomPlaylist([]);
      setNowPlayingPlaylist([]);
      setNowPlayingPlaylistID("");
      setNowRandomPlaylistID("");
    }, 100);

    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // ================================================== 음악 재생시간 관련

  //      state:  url 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      event handler:  url 시간 셋팅 이벤트 함수       //
  const handleDuration = (infoDuration: number) => {
    setInfoDuration(infoDuration);
  };

  // ====================================================== 재생목록 관련

  //      state:  재생목록 팝업 상태 상태        //
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  //      event handler:  재생목록 추가 버튼 클릭 이벤트 함수       //
  const togglePlaylistPopup = () => {
    if (!loginUserInfo) {
      alert("로그인 이후 추가해주세요.");
      navigator(SIGN_IN_PATH());
      return;
    }
    if (!searchUrl) {
      alert("음악 검색 후 시도 해주셈");
      return;
    }
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  //      useEffect : 쿠키가 없을때 set되어 있던 재생목록 초기화     //
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
    responseBody: GetPlaylistResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetPlaylistResponseDto;
    setPlaylistLibrary(playListResult.playListLibrary);
  };

  // ====================================================== 에러 관련
  //      state:  info페이지 에러 상태        //
  const [isInfoError, setIsInfoError] = useState<boolean>(false);

  //      event handler: 에러 발생시 이벤트 처리 함수       //
  const resetInfo = () => {
    resetInfoData();
    setInfoDuration(0);
  };

  const testBtn = () => {
    console.log("infoData 값 : ", JSON.stringify(infoData));
  };

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && <LoadingScreen />}
      <div
        className={`${styles["main-left"]} ${isLoading ? styles["blur"] : ""}`}
      >
        <div className={styles["music-info"]} onClick={() => testBtn()}>
          Search Music
        </div>
        <div
          className={styles["music-info-image"]}
          style={{
            backgroundImage: `url(${infoData.thumb})`,
          }}
        ></div>
        <div className={styles["music-info-data"]}>
          <div className={styles["music-info-title-box"]}>
            <div className={styles["title-info"]}>Title</div>
            <div className={styles["title-data"]}>{infoData.vidTitle}</div>
          </div>
          <div className={styles["music-info-artist-box"]}>
            <div className={styles["artist-info"]}>Artist</div>
            <div className={styles["artist-data"]}>{infoData.author}</div>
          </div>
          <div className={styles["music-info-link-box"]}>
            <div className={styles["link-info"]}>Link</div>
            <div
              className={styles["link-data"]}
              onClick={() => {
                handleOpenVideo();
              }}
              style={{
                cursor: infoData.vidUrl === "-" ? undefined : "pointer",
              }}
            >
              {infoData.vidUrl}
            </div>
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
      {searchUrl && (
        <ReactPlayer
          url={searchUrl}
          playing={false}
          onDuration={handleDuration}
          style={{ display: "none" }} // 완전히 숨김 처리
          onError={(e) => {
            alert(
              "동영상 소유자가 외부 재생을 제한했습니다. YouTube에서 직접 시청해주세요."
            );
            resetInfo();
            setIsInfoError(true);
            setSearchUrl("");
          }}
          onReady={() => {
            setIsLoading(false);
            setIsInfoError(false);
          }}
        />
      )}

      {/* =======================================재생목록 팝업 */}
      {playlistPopupOpen && (
        <PlaylistLibrary
          infoData={infoData}
          infoDuration={infoDuration}
          playlistPopupOpen={playlistPopupOpen}
          setPlaylistPopupOpen={setPlaylistPopupOpen}
        />
      )}
    </>
  );
};

export default MusicInfo;
