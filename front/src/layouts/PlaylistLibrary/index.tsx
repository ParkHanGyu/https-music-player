import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import AddPlayListToMusicRequestDto from "../../apis/request/add-playlist-to-music.dto";
import {
  getPlayListLibraryReqeust,
  getPlaylistMusicReqeust,
  playlistAddMusicReqeust,
  playlistCreateReqeust,
} from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";
import CreatePlayListRequestDto from "../../apis/request/create-play-list-request.dto";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import { ResponseUtil } from "../../utils";
import { useVideoStore } from "../../store/useVideo.store";
import GetMusicResponseDto from "../../apis/response/Music/get-music.dto";
import { useParams } from "react-router-dom";
import Music from "../../types/interface/music.interface";
import NoembedMusicInfoData from "../../types/interface/music-info-data.interface";
import TestInfoData from "../../types/interface/music-info-data-test.interface";
import AddPlayListToMusicTestRequestDto from "../../apis/request/add-playlist-to-music-test.dto";
import AddMusicInfoData from "../../types/interface/music-info-data-test.interface";

interface PlaylistLibraryProps {
  infoData: AddMusicInfoData[];
  // infoData: NoembedMusicInfoData;
  // infoDuration: number;
  playlistPopupOpen: boolean;
  setPlaylistPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlaylistLibrary: React.FC<PlaylistLibraryProps> = ({
  infoData,
  // infoData,
  // infoDuration,
  playlistPopupOpen,
  setPlaylistPopupOpen,
}) => {
  //      Zustand state : playBar url, info, 로딩 상태      //
  const { setPlaylistLoading, playBarUrl } = useVideoStore();
  const { playlistLibrary, setPlaylistLibrary } = usePlaylistStore();
  const [cookies] = useCookies();

  //      Zustand state : playBar 재생목록 상태      //
  const {
    nowPlayingPlaylistID,
    setNowRandomPlaylist,
    nowRandomPlaylist,
    setNowPlayingPlaylist,
  } = usePlaylistStore();

  const { playlistId } = useParams();

  // 팝업 관련
  const [isAddPlaylistPopupOpen, setAddPlaylistPopupOpen] = useState(false); // 추가 팝업 상태 추가
  //      event handler: 재생 목록에 음악 추가 클릭 이벤트 처리 함수      //
  const toggleAddMusicToPlaylist = (
    requestBody: AddPlayListToMusicTestRequestDto
    // testData : TestInfoData[], playlistId: string | undefined
  ) => {
    if (!infoData) {
      return;
    }

    console.log("로딩 true");
    setPlaylistLoading(true);
    console.log(
      "api에 보내는 데이터 : " + JSON.stringify(requestBody, null, 2)
    );
    // 음악 추가 api 실행
    playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
      (responseBody) => playlistAddMusicResponse(responseBody)
    );
  };
  const playlistAddMusicResponse = (responseBody: ResponseDto | null) => {
    if (!ResponseUtil(responseBody)) {
      alert(responseBody?.message);
      setPlaylistPopupOpen(false);
      console.log("로딩 false");
      setPlaylistLoading(false);
      return;
    }
    setPlaylistPopupOpen(!playlistPopupOpen);
    setPlaylistLoading(false);
  };

  //================================= add 팝업 관련
  const addPlayListInputRef = useRef<HTMLInputElement>(null); // input ref 생성

  //      event handler: 재생목록 추가 버튼 클릭 이벤트 처리 함수      //
  const toggleAddPlaylistPopup = () => {
    console.log("재생목록 추가 실행");
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
    console.log("다룰 데이터 : " + JSON.stringify(infoData, null, 2));
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
                      // musicInfoData: infoData,
                      // infoDuration: infoDuration,
                      // musicInfoData: testData[index].basicInfo,
                      // infoDuration: testData[index].infoDuration,
                      addInfoDataDto: infoData,
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
