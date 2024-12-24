import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import AddPlayListToMusicRequestDto from "../../apis/request/add-playlist-to-music.dto";
import {
  getPlayListLibraryReqeust,
  playlistAddMusicReqeust,
  playlistCreateReqeust,
} from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";
import { YoutubeInfo } from "../../types/interface/youtube.interface";
import CreatePlayListRequestDto from "../../apis/request/create-play-list-request.dto";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import { ResponseUtil } from "../../utils";

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

  const [cookies] = useCookies();

  // url 시간 상태

  // 팝업 관련
  const [isAddPlaylistPopupOpen, setAddPlaylistPopupOpen] = useState(false); // 추가 팝업 상태 추가
  //      event handler: 재생 목록에 음악 추가 클릭 이벤트 처리 함수      //
  const toggleAddMusicToPlaylist = (
    requestBody: AddPlayListToMusicRequestDto
  ) => {
    if (!requestBody.youtube) return;
    playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
      playlistAddMusicResponse
    );
  };
  const playlistAddMusicResponse = (responseBody: ResponseDto | null) => {
    if (!ResponseUtil(responseBody)) {
      alert(responseBody?.message);
      setPlaylistPopupOpen(false);
      return;
    }

    alert("음악 추가됨");
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  //================================= add 팝업 관련

  const addPlayListInputRef = useRef<HTMLInputElement>(null); // input ref 생성

  //      event handler: 재생목록 추가 버튼 클릭 이벤트 처리 함수      //
  const toggleAddPlaylistPopup = () => {
    alert("재생목록 추가 실행");
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
    if (!ResponseUtil(responseBody)) {
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
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetPlaylistResponseDto;

    setPlaylistLibrary(playListResult.playListLibrary);
  };

  const testBtn = () => {
    alert(isAddPlaylistPopupOpen);
  };
  return (
    <>
      <div
        className={styles["playlist-popup"]}
        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
          event.stopPropagation()
        }
      >
        <div className={styles["playlist-popup-content"]}>
          <div className={styles["playlist-popup-top"]}>
            <h3 onClick={() => testBtn()}>My Playlist</h3>
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
                  onClick={(event: React.MouseEvent<HTMLLIElement>) => (
                    event.stopPropagation(),
                    toggleAddMusicToPlaylist({
                      youtube: infoData,
                      infoDuration: infoDuration,
                      playlistId: playlist.playlistId,
                    })
                  )}
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
