import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import ReactPlayer from "react-player";
import useFormatTime from "../../hooks/useFormatTime";
import { YoutubeInfo } from "../../types/interface/youtube.interface";
import {
  getPlayListLibraryReqeust,
  playlistAddMusicReqeust,
  playlistCreateReqeust,
} from "../../apis";
import AddPlayListRequestDto from "../../apis/request/create-play-list-request.dto";
import GetPlayListResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import ResponseDto from "../../apis/response/response.dto";
import AddPlayListToMusicRequestDto from "../../apis/request/add-playlist-to-music.dto";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useLoginUserStore from "../../store/login-user.store";
import { SIGN_IN_PATH } from "../../constant";

const MusicInfo = () => {
  const {
    isPlaying,
    setIsPlaying,
    urlId,
    setUrlId,
    setPlayBarUrl,
    setPlayBarInfo,
    setPlaylists,
    playlists,
  } = useVideoStore();
  const [cookies] = useCookies();
  const { playlistId } = useParams();
  const formatTime = useFormatTime();
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();

  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjb6DRcr48cY8lS0pYoQ4JjiEyrFlxWvWsw&s"; // 기본 이미지 URL
  const { youtube, setYoutube, getInfo } = useYoutubeInfo(defaultImage); // 커스텀 훅 사용

  useEffect(() => {
    if (urlId) {
      getInfo(urlId);
    }
  }, [urlId]);

  // 정보 초기화
  const resetYoutubeInfo = () => {
    setYoutube({
      vidUrl: `youtu.be/${urlId}`,
      author: "-",
      thumb: defaultImage, // 기본 이미지 설정
      vidTitle: "-",
    });
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
    setPlayBarInfo(youtube);
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
    if (!urlId) {
      alert("음악 검색 후 시도 해주셈");
      return;
    }
    if (!loginUser) {
      alert("로그인해주세요");
      navigator(SIGN_IN_PATH());
      return;
    }
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  // 팝업 관련
  const [isAddPlaylistPopupOpen, setAddPlaylistPopupOpen] = useState(false); // 추가 팝업 상태 추가

  const craetePlayList = () => {
    setAddPlaylistPopupOpen(!isAddPlaylistPopupOpen);
  };

  // add 팝업 관련
  const addPlayListInputRef = useRef<HTMLInputElement>(null); // input ref 생성

  //      event handler: 재생목록 추가 버튼 클릭 이벤트 처리 함수      //
  const toggleAddPlaylistPopup = () => {
    if (addPlayListInputRef.current) {
      if (!addPlayListInputRef.current.value.trim()) {
        alert("재생목록의 제목을 입력해주세요.");
        return;
      }

      const playListName = addPlayListInputRef.current.value;

      const requestBody: AddPlayListRequestDto = { playListName };

      playlistCreateReqeust(requestBody, cookies.accessToken).then(
        playListAddResponse
      );
    }
  };

  const playListAddResponse = (responseBody: { code: string }) => {
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }
    craetePlayList();
  };

  // =========== 재생목록 셋팅 ===============================
  useEffect(() => {
    if (cookies.accessToken) {
      getPlayListLibraryReqeust(cookies.accessToken).then(
        getPlaylistLibraryResponse
      );
    }
  }, [cookies.accessToken, isAddPlaylistPopupOpen]);

  const getPlaylistLibraryResponse = (
    responseBody: GetPlayListResponseDto | ResponseDto | null
  ) => {
    console.log(responseBody);

    if (!responseBody) {
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }

    const playListResult = responseBody as GetPlayListResponseDto;

    setPlaylists(playListResult.playlists);
  };

  //      event handler: 재생 목록에 음악 추가 클릭 이벤트 처리 함수      //
  const toggleAddMusicToPlaylist = (
    requestBody: AddPlayListToMusicRequestDto
  ) => {
    if (!requestBody.youtube) return;

    console.log(
      "음악 추가 api requestBody 값 :  " + JSON.stringify(requestBody)
    );
    console.log("음악 추가 api accessToken 값 :  " + cookies.accessToken);

    playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
      playlistAddMusicResponse
    );
  };

  // const toggleAddMusicToPlaylist = (
  //   youtube: YoutubeInfo,
  //   infoDuration: number,
  //   playlistId: bigint
  // ) => {
  //   if (!youtube) {
  //     return;
  //   }

  //   const requestBody: AddPlayListToMusicRequestDto = {
  //     youtube,
  //     infoDuration,
  //     playlistId,
  //   };

  //   console.log("음악 추가 api requestBody 값 :  " + requestBody);
  //   console.log("음악 추가 api accessToken 값 :  " + cookies.accessToken);

  //   playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
  //     playlistAddMusicResponse
  //   );
  // };

  const playlistAddMusicResponse = (responseBody: ResponseDto | null) => {
    console.log(
      "음악 추가 api 클라이언트 Response 값 : " + JSON.stringify(responseBody)
    );

    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }

    alert("음악 추가됨");
    setPlaylistPopupOpen(!playlistPopupOpen);

    const specificUrl = `/play-list/${playlistId}`;
    const currentUrl = window.location.pathname;

    // navigator(0);
    if (currentUrl === specificUrl) {
      alert("url이 같음");
      // navigator(-1);
      // window.location.replace(window.location.href);
      //  + playList 새로고침 하게 하기
    }
  };

  // ==========================
  // info페이지 에러 상태
  const [isInfoError, setIsInfoError] = useState<boolean>(false);

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
            <div className={styles["title-data"]}>{youtube.vidTitle}</div>
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
      {urlId && (
        <ReactPlayer
          url={`youtu.be/${urlId}`}
          playing={false}
          onDuration={handleDuration}
          style={{ display: "none" }} // 완전히 숨김 처리
          onError={(e) => {
            alert(
              "동영상 소유자가 외부 재생을 제한했습니다. YouTube에서 직접 시청해주세요."
            );
            resetYoutubeInfo();
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
        <div className={styles["playlist-popup"]}>
          <div className={styles["playlist-popup-content"]}>
            <div className={styles["playlist-popup-top"]}>
              <h3>Select Playlist</h3>
              <div
                className={styles["playlist-popup-close"]}
                onClick={togglePlaylistPopup}
              ></div>
            </div>

            <div className={styles["playlist-popup-center"]}>
              <ul>
                {playlists.map((playlist, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      toggleAddMusicToPlaylist({
                        youtube: youtube,
                        infoDuration: infoDuration,
                        playlistId: playlist.playlistId,
                      })
                    }
                  >
                    {playlist.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles["playlist-popup-bottom"]}>
              <div
                className={styles["playlist-popup-add"]}
                onClick={craetePlayList}
              ></div>
            </div>
          </div>
        </div>
      )}
      {/* 재생목록 add 화면 */}
      {isAddPlaylistPopupOpen && (
        <div className={styles["add-playlist-popup"]}>
          <div className={styles["add-playlist-popup-content"]}>
            <div className={styles["add-playlist-popup-top"]}>
              <h3>Create New Playlist</h3>
              <div
                className={styles["add-playlist-popup-close-btn"]}
                onClick={() => setAddPlaylistPopupOpen(false)}
              ></div>
            </div>

            <div className={styles["add-playlist-popup-bottom"]}>
              <input
                ref={addPlayListInputRef}
                type="text"
                placeholder="New playlist name"
              />

              <div
                className={styles["add-playlist-popup-add-btn"]}
                onClick={toggleAddPlaylistPopup}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicInfo;
