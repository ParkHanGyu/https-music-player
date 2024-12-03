import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import useLoginUserStore from "../../store/login-user.store";
import { useNavigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../../constant";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import AddPlayListToMusicRequestDto from "../../apis/request/add-playlist-to-music.dto";
import {
  getPlayListLibraryReqeust,
  playlistAddMusicReqeust,
  playlistCreateReqeust,
} from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";
import { YoutubeInfo } from "../../types/interface/youtube.interface";
import CreatePlayListRequestDto from "../../apis/request/create-play-list-request.dto";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";

interface Playlist {
  playlistId: string;
  title: string;
}

interface PlaylistLibraryProps {
  infoData: YoutubeInfo;
  infoDuration: number;
  playlistPopupOpen: boolean;
  setPlaylistPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlaylistLibrary: React.FC<PlaylistLibraryProps> = ({
  infoData,
  infoDuration,
  playlistPopupOpen,
  setPlaylistPopupOpen,
}) => {
  const { playlistLibrary, setPlaylistLibrary } = usePlaylistStore();

  const { urlId, setUrlId, setPlayBarUrl, setPlayBarInfo } = useVideoStore();
  const { loginUser } = useLoginUserStore();
  const navigator = useNavigate();
  const [cookies] = useCookies();

  // url 시간 상태

  // 팝업 관련
  const [isAddPlaylistPopupOpen, setAddPlaylistPopupOpen] = useState(false); // 추가 팝업 상태 추가
  const craetePlayList = () => {
    setAddPlaylistPopupOpen(!isAddPlaylistPopupOpen);
  };

  //      event handler: 재생 목록에 음악 추가 클릭 이벤트 처리 함수      //
  const toggleAddMusicToPlaylist = (
    requestBody: AddPlayListToMusicRequestDto
  ) => {
    alert("복사 실행");
    console.log(
      "음악 추가 기능 실행. 서버에 보내는 데이터 : " +
        JSON.stringify(requestBody)
    );
    if (!requestBody.youtube) return;
    playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
      playlistAddMusicResponse
    );
  };
  const playlistAddMusicResponse = (responseBody: ResponseDto | null) => {
    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code === "DM") alert(responseBody.message);
    if (code !== "SU") {
      return false;
    }

    alert("음악 추가됨");
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  //================================= add 팝업 관련

  const addPlayListInputRef = useRef<HTMLInputElement>(null); // input ref 생성

  //      event handler: 재생목록 추가 버튼 클릭 이벤트 처리 함수      //
  const toggleAddPlaylistPopup = () => {
    if (addPlayListInputRef.current) {
      if (!addPlayListInputRef.current.value.trim()) {
        alert("재생목록의 제목을 입력해주세요.");
        return;
      }

      const playListName = addPlayListInputRef.current.value;

      const requestBody: CreatePlayListRequestDto = { playListName };

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
    setAddPlaylistPopupOpen(!isAddPlaylistPopupOpen);
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
    responseBody: GetPlaylistResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }

    const playListResult = responseBody as GetPlaylistResponseDto;

    setPlaylistLibrary(playListResult.playListLibrary);
  };
  return (
    <>
      <div className={styles["playlist-popup"]}>
        <div className={styles["playlist-popup-content"]}>
          <div className={styles["playlist-popup-top"]}>
            <h3>Select Playlist</h3>
            <div
              className={styles["playlist-popup-close"]}
              onClick={() => setPlaylistPopupOpen(!playlistPopupOpen)}
            ></div>
          </div>

          <div className={styles["playlist-popup-center"]}>
            <ul>
              {playlistLibrary.map((playlist, index) => (
                <li
                  key={index}
                  onClick={() =>
                    toggleAddMusicToPlaylist({
                      youtube: infoData,
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
              onClick={() => setAddPlaylistPopupOpen(!isAddPlaylistPopupOpen)}
            ></div>
          </div>
        </div>
      </div>

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

export default PlaylistLibrary;
