import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./style.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  LIKE_PATH,
  MAIN_PATH,
  MY_LIKE_PATH,
  PLAY_LIST_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  TEST_PATH,
} from "../../constant";
import useLoginUserStore from "../../store/login-user.store";
import { useCookies } from "react-cookie";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import {
  deletePlaylist,
  getPlayListLibraryReqeust,
  updatePlaylistNameRequest,
  uploadProfileImageRequest,
} from "../../apis";
import GetUserImageResponseDto from "../../apis/response/user/get-user-new-image-url.dto";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import useOutsideClick from "../../hooks/useOutsideClick";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import Playlist from "../../types/interface/playList.interface";
import updatePlaylistNameRequestDto from "../../apis/request/update-playlist-name.dto";
import { useVideoStore } from "../../store/useVideo.store";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { userInfo } from "os";

const Menu = () => {
  //      Zustand state : playBar 재생목록 상태      //
  const {
    setNowPlayingPlaylist,
    nowPlayingPlaylistID,
    setNowPlayingPlaylistID,
    setNowRandomPlaylist,
    setNowRandomPlaylistID,
  } = usePlaylistStore();

  //      Zustand state : playBar url, info, 로딩 상태      //
  const { setPlayBarUrl, resetPlayBarInfo } = useVideoStore();

  //    Zustand state : PlayBar 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();

  // url ID
  const { playlistId } = useParams();
  // 쿠키
  const [cookies, removeCookie, deleteCookie] = useCookies();

  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo, setLoginUserInfo } = useLoginUserStore();

  const { playlistLibrary, setPlaylistLibrary } = usePlaylistStore();
  const navigator = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  // const tokenExp = useTokenExpiration(cookies.accessToken);

  const playListClickHandler = () => {
    console.log("실행");
    setIsPlaylistDrop(!isPlaylistDrop);
  };

  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  const testValue = () => {
    navigator(TEST_PATH());
    // console.log("playlistLibrary", JSON.stringify(playlistLibrary));
    // console.log("playlistId : ", playlistId);
  };

  //========================================== playlist 드롭박스
  //      state: playlist 드롭 상태        //
  const [isPlaylistDrop, setIsPlaylistDrop] = useState(false);
  // url이 play-list을 포함할때. 즉 사용자가 재생목록을 보고 있다면
  useEffect(() => {
    // url이 "play-list"를 포함하고 재생목록 드롭박스가 열려있지 않으면
    if (currentPath.includes("play-list") && !isPlaylistDrop) {
      // 열어주기
      setIsPlaylistDrop(true);

      // url이 "play-list"를 포함하지 않고 재생목록 드롭박스가 열려있으면
    } else if (!currentPath.includes("play-list") && isPlaylistDrop) {
      setIsPlaylistDrop(false);
    } else {
      return;
    }
  }, [currentPath]);

  // ++ ====== playlist item
  const showPlaylistDetail = (playlistId: bigint) => {
    if (!loginUserInfo) {
      alert("로그인 만료");
      navigator(MAIN_PATH());
      return;
    }

    setIsOpen(false);
    if (currentPath !== `/play-list/${playlistId}`) {
      navigator(PLAY_LIST_PATH(playlistId));
    }
    return;
  };

  // ============================================ menu item
  const openPlatformPage = (pageName: string) => {
    if (pageName === "youtube") {
      window.open(`https://www.${pageName}.com`);
    }
    if (pageName === "soundcloud") {
      window.open(`https://www.${pageName}.com`);
    }
  };

  //      event handler: Top 클릭 이벤트 처리 함수       //
  const onTopClickHandler = () => {
    navigator(LIKE_PATH());
  };

  //      event handler: Like 클릭 이벤트 처리 함수       //
  const onLikeClickHandler = () => {
    if (!loginUserInfo) {
      alert("로그인을 해주세요!");
      return;
    }
    navigator(MY_LIKE_PATH());
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignInClickHandler = () => {
    navigator(SIGN_IN_PATH());
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignUpClickHandler = () => {
    navigator(SIGN_UP_PATH());
  };

  //      event handler: 로그아웃 클릭 이벤트 처리 함수       //
  const onSignOutBtnClickHandler = () => {
    if (cookies.accessToken) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      alert("로그아웃 되었습니다.");
      navigator(MAIN_PATH());
    }
  };

  // ===================================================== 프로필 이미지 관련
  const onImageModifyHandler = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    fileInput?.click(); // 숨겨진 파일 입력창 클릭
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      alert("파일을 선택하세요.");
      return;
    }
    if (loginUserInfo) {
      uploadProfileImageRequest(
        loginUserInfo.profileImage,
        selectedFile,
        cookies.accessToken
      ).then(uploadProfileImageResponse);
    }
  };
  const uploadProfileImageResponse = (
    responseBody: GetUserImageResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const profileImage = responseBody as GetUserImageResponseDto;
    // const IMAGE_BASE_URL = process.env.REACT_APP_API_URL;
    // const fullUrl = `${IMAGE_BASE_URL}${profileImage.url}`;
    const fullUrl = `${profileImage.url}`;
    if (loginUserInfo) {
      setLoginUserInfo({
        ...loginUserInfo,
        profileImage: fullUrl, // 새 URL로 업데이트
      });
    }
  };

  // ======================================= playlist item별 더보기 버튼 관련
  //      state: playlist item action btn 드롭 상태        //
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  //      hook: 외부 클릭 커스텀 훅       //
  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLUListElement>(false);

  //      event handler: >> : << 버튼 클릭시 동작 이벤트 처리 함수       //
  const onMenuAction = (index: number) => {
    // 현재 선택된 인덱스가 열려있다면 닫고,
    if (openDropdownIndex === index) {
      setIsOpen(false);
      setOpenDropdownIndex(null);
      return;
    } else {
      // 아니면 열기.
      // 열어줄 index를 set해줌
      setOpenDropdownIndex(index);
      setIsOpen(true); // 외부 클릭 시 닫히는 기능 추가
    }
  };

  useEffect(() => {
    if (!isOpen && openDropdownIndex !== null) {
      console.log("isOpen이 바뀌어서 useEffect if문 실행");
      setOpenDropdownIndex(null);
    }
  }, [isOpen]);

  // 시작 ====================================== 재생목록 삭제 기능
  const onHandlePlaylistDelete = (deletePlaylistId: bigint) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (isConfirmed) {
      deletePlaylist(deletePlaylistId, cookies.accessToken).then(
        (responseBody) => deletePlaylistResponse(responseBody, deletePlaylistId)
      );
    }
  };
  const deletePlaylistResponse = (
    responseBody: ResponseDto | null,
    deletePlaylistId: bigint
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    // 재생목록 최신화
    getPlayListLibraryReqeust(cookies.accessToken).then(
      getPlaylistLibraryResponse
    );

    // 현재 듣는 재생목록이라면 초기화
    if (deletePlaylistId.toString() === nowPlayingPlaylistID) {
      setNowPlayingPlaylist([]);
      setNowRandomPlaylist([]);
      setNowPlayingPlaylistID("");
      setNowRandomPlaylistID("");
      setPlayBarUrl("");
      resetPlayBarInfo();
      setIsPlaying(false);
    }

    // 삭제한 재생목록과 현재 보고있는 재생목록이 같다면 메인으로
    if (deletePlaylistId.toString() === playlistId) {
      navigator(MAIN_PATH());
    }
  };
  const getPlaylistLibraryResponse = (
    responseBody: GetPlaylistResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const playListResult = responseBody as GetPlaylistResponseDto;
    setPlaylistLibrary(playListResult.playListLibrary);
  };

  // 끝 =================================== 재생목록 삭제
  // 시작 ================================= 재생목록 이름 수정
  //      state: 수정할 재생목록 ID 상태        //
  const [modifyPlaylistId, setModifyPlaylistId] = useState<bigint>(BigInt(0));
  //      state: 변경할 재생목록 name 상태        //
  const [modifyName, setModifyName] = useState<string>("");
  //      state: modify 팝업 상태        //
  const [isModifyPlaylistPopupOpen, setIsModifyPlaylistPopupOpen] =
    useState(false);

  //      event handler: 재생목록 name 변경 이벤트 처리 함수      //
  const onModifyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setModifyName(value);
  };

  //      event handler: 재생목록 수정 버튼 클릭 이벤트 처리 함수      //
  const toggleModifyPlaylistPopup = () => {
    // 필요한것 : 수정 할 재생목록 id, 수정 할 재생목록 name, 쿠키
    // 1. 클라이언트에서 바꾸려는 name과 기존 name이 일치한지 확인
    // 2. 확인후 이상 없으면 수정 할 재생목록 id, 수정 할 재생목록 name,
    //    쿠키를 가지고 api 요청
    // 3. 응답값 받고 최신화 해주기 (api로 재생목록 다시 불러오기)

    const playlist = playlistLibrary.find((item) => item.title === modifyName);
    if (playlist && modifyName === playlist.title) {
      alert("기존 이름과 동일합니다.");
      return;
    }

    const requestBody: updatePlaylistNameRequestDto = {
      modifyName: modifyName,
    };

    updatePlaylistNameRequest(
      requestBody,
      modifyPlaylistId,
      cookies.accessToken
    ).then(modifyPlaylistNameResponse);
  };
  const modifyPlaylistNameResponse = (responseBody: ResponseDto | null) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    // 재생목록 최신화
    getPlayListLibraryReqeust(cookies.accessToken).then(
      getPlaylistLibraryResponse
    );

    setIsModifyPlaylistPopupOpen(false);
  };

  //      event handler: 더보기 btn에서 수정 버튼 클릭 이벤트 처리 함수      //
  const onHandlePlaylistModify = (targetPlaylist: Playlist) => {
    setModifyName(targetPlaylist.title);
    setModifyPlaylistId(targetPlaylist.playlistId);
    setIsModifyPlaylistPopupOpen(true);
  };

  return (
    <div className={styles["menu-container"]}>
      {loginUserInfo ? (
        <div className={styles["menu-user-info-box"]}>
          <div
            className={styles["menu-user-info-image"]}
            style={
              loginUserInfo.profileImage
                ? { backgroundImage: `url(${loginUserInfo.profileImage})` }
                : {}
            }
            onClick={onImageModifyHandler}
          ></div>

          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className={styles["menu-user-info-email"]}>
            {loginUserInfo?.email}
          </div>
          <div
            className={styles["menu-user-info-logout-btn"]}
            onClick={onSignOutBtnClickHandler}
          ></div>
        </div>
      ) : (
        <div className={styles["menu-sign-box"]}>
          <div
            className={styles["menu-user-sign-in-btn"]}
            onClick={onSignInClickHandler}
          >
            SIGN IN
          </div>
          <div
            className={styles["menu-user-sign-up-btn"]}
            onClick={onSignUpClickHandler}
          >
            SIGN UP
          </div>
        </div>
      )}

      <div className={styles["main-menu-box"]}>
        <div className={styles["main-menu-item1"]} onClick={homeClickHandler}>
          Home
        </div>
        <div
          className={styles["main-menu-item2"]}
          onClick={playListClickHandler}
        >
          <p>PlayList</p>
          {isPlaylistDrop && (
            <ul style={{ margin: !playlistLibrary.length ? "0px" : undefined }}>
              {playlistLibrary.map((playlist, index) => (
                <li
                  className={styles["main-menu-item-li"]}
                  style={{
                    backgroundColor:
                      // playlistId === (index + 1).toString()
                      playlistId ===
                      playlistLibrary[index].playlistId.toString()
                        ? "#333333"
                        : undefined,

                    color:
                      playlistId === playlist.playlistId.toString()
                        ? "#ffffff"
                        : undefined,
                  }}
                  key={index}
                  onClick={(
                    // li 클릭시 ul에 있는 함수가 실행. 전파 방지
                    event: React.MouseEvent<HTMLLIElement, MouseEvent>
                  ) => {
                    event.stopPropagation();
                    showPlaylistDetail(playlist.playlistId);
                  }}
                >
                  {playlist.title}

                  {/* ===========================================*/}
                  {/* 더보기 btn >> : << */}
                  <div
                    className={styles["menu-item-action-btn"]}
                    onClick={(
                      event: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      event.stopPropagation();
                      onMenuAction(index); // 클릭된 음악의 인덱스를 전달
                    }}
                    style={{
                      display:
                        openDropdownIndex === index && isOpen ? "block" : "",
                    }}
                  >
                    {/* 더보기 드롭다운. >> : << 클릭시 보이는 드롭다운 */}
                    {/* set해준 값과 index가 일치하면 보여줌  */}
                    {/* ul, li */}
                    {openDropdownIndex === index && isOpen && (
                      <ul ref={ref}>
                        <li
                          onClick={() => {
                            // 이름 수정
                            onHandlePlaylistModify(playlistLibrary[index]); // 클릭된 음악의 ID를 전달
                          }}
                        >
                          이름수정
                        </li>
                        <li
                          onClick={() => {
                            // 삭제
                            onHandlePlaylistDelete(
                              playlistLibrary[index].playlistId
                            ); // 클릭된 음악의 인덱스를 전달
                          }}
                        >
                          삭제
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={styles["main-menu-item3"]}
          style={{
            backgroundColor:
              window.location.hash === "#/like/rank" ? "#333333" : undefined,
          }}
          onClick={onTopClickHandler}
        >
          TOP
        </div>

        <div
          className={styles["main-menu-item4"]}
          style={{
            backgroundColor:
              window.location.hash === "#/like/my" ? "#333333" : undefined,
          }}
          onClick={onLikeClickHandler}
        >
          MyLike
        </div>

        <div
          className={styles["main-menu-item5"]}
          onClick={() => openPlatformPage("youtube")}
        >
          Youtube
        </div>
        <div
          className={styles["main-menu-item6"]}
          onClick={() => openPlatformPage("soundcloud")}
        >
          SoundCloud
        </div>

        <div className={styles["main-menu-item7"]} onClick={testValue}>
          TEST
        </div>

        {/* 재생목록 add 화면 */}
        {isModifyPlaylistPopupOpen && (
          <div className={styles["modify-playlist-popup"]}>
            <div className={styles["modify-playlist-popup-content"]}>
              <div className={styles["modify-playlist-popup-top"]}>
                <h3>Modify Playlist Name</h3>
                <div
                  className={styles["modify-playlist-popup-close-btn"]}
                  onClick={() => setIsModifyPlaylistPopupOpen(false)}
                ></div>
              </div>

              <div className={styles["modify-playlist-popup-bottom"]}>
                <input
                  value={modifyName}
                  type="text"
                  onChange={onModifyChangeHandler}
                />

                <div
                  className={styles["modify-playlist-popup-btn"]}
                  onClick={toggleModifyPlaylistPopup}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
