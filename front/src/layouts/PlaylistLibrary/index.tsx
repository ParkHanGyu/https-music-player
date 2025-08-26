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

interface PlaylistLibraryProps {
  infoData: NoembedMusicInfoData;
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
    requestBody: AddPlayListToMusicRequestDto
  ) => {
    if (!requestBody) {
      return;
    }

    console.log("로딩 true");
    setPlaylistLoading(true);

    const addPlaylistID = String(requestBody.playlistId);

    // 음악 추가 api 실행
    playlistAddMusicReqeust(requestBody, cookies.accessToken).then(
      (responseBody) => playlistAddMusicResponse(responseBody, addPlaylistID)
    );
  };
  const playlistAddMusicResponse = (
    responseBody: ResponseDto | null,
    addPlaylistID: string
  ) => {
    // 위에 api 추가를 성공하지 못하면 에러 발생하고 추가 컴포넌트 off.
    // 성공하면 방금 추가한 재생목록의 노래를 최신 데이터를 받아오고 싶어함. 이유는
    // 현재 듣는 노래의 재생목록과 추가한 노래의 재생목록이 같으면 반영해야 하니까.
    // 근데 내가 작성한 코드는 현재 듣는 노래의 재생목록과 추가한 재생목록이 같지 않아도
    // 최신화 시켜주려고함. 불필요한 요소임. 수정할것.
    if (!ResponseUtil(responseBody)) {
      alert(responseBody?.message);
      setPlaylistPopupOpen(false);
      console.log("로딩 false");
      setPlaylistLoading(false);
      return;
    }
    setPlaylistPopupOpen(!playlistPopupOpen);

    // 재생중인 재생목록과 방금 추가한 노래의 재생목록이 같지 않으면
    if (nowPlayingPlaylistID !== addPlaylistID) {
      setPlaylistLoading(false);
      return;
    }

    getPlaylistMusicReqeust(addPlaylistID, cookies.accessToken).then(
      (responseBody) => getPlaylistMusicResponse(responseBody, addPlaylistID)
    );
  };

  const getPlaylistMusicResponse = (
    responseBody: GetMusicResponseDto | ResponseDto | null,
    addPlaylistID: string
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetMusicResponseDto;

    // 현재 듣고 있는 노래의 재생목록에 노래를 추가했다면 최신화 시켜줘야함
    if (nowPlayingPlaylistID === addPlaylistID) {
      // nowRandomPlaylist에서 지금 듣는 노래의 index. 기준 찾기
      const nowIndex = nowRandomPlaylist.findIndex((music) =>
        music.basicInfo.url.includes(playBarUrl)
      );

      if (nowIndex !== -1) {
        // 2. nowIndex를 기준으로 beforeArray / afterArray로 배열 나누기
        const beforeArray = nowRandomPlaylist.slice(0, nowIndex + 1);
        const afterArray = nowRandomPlaylist.slice(nowIndex + 1);

        // 3. nowRandomPlaylist와 playListResult.musicList을 비교해서 추가된 곡 찾기
        const additionalItems = playListResult.musicList.filter(
          (item) =>
            !nowRandomPlaylist.some(
              (existingItem) => existingItem.musicId === item.musicId
            )
        );

        // 4. 랜덤한 위치 선택
        const randomIndex = Math.floor(Math.random() * (afterArray.length + 1));

        // 5. afterArray 배열에서 랜덤한 위치로 추가한 노래(additionalItems[0])를 삽입
        afterArray.splice(randomIndex, 0, additionalItems[0]);

        // 6. 최종 배열 합치기
        const updatedPlaylist = [...beforeArray, ...afterArray];

        setNowRandomPlaylist(updatedPlaylist);
        setNowPlayingPlaylist(playListResult.musicList);
      }
    }
    console.log("로딩 false");
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
                      musicInfoData: infoData,
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
