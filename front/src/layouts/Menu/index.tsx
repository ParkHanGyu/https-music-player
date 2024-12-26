import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MAIN_PATH,
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
  uploadProfileImageRequest,
} from "../../apis";
import GetUserImageResponseDto from "../../apis/response/user/get-user-new-image-url.dto";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import useOutsideClick from "../../hooks/useOutsideClick";
import GetPlaylistResponseDto from "../../apis/response/PlayList/playlist-library.dto";

const Menu = () => {
  const { playlistId } = useParams();
  const [cookies, removeCookie, deleteCookie] = useCookies();

  const { loginUser, setLoginUser } = useLoginUserStore();

  const { playlistLibrary, setPlaylistLibrary } = usePlaylistStore();
  const navigator = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const playListClickHandler = () => {
    setIsPlaylistDrop(!isPlaylistDrop);
  };

  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

  //==========================================

  const testValue = () => {
    // navigator(TEST_PATH());
    console.log("playlistLibrary : ", playlistLibrary);
  };

  useEffect(() => {
    if (currentPath.includes("play-list")) {
      setIsPlaylistDrop(true);
    } else {
      setIsPlaylistDrop(false);
    }
  }, [currentPath]);

  const [isPlaylistDrop, setIsPlaylistDrop] = useState(false);

  const showPlaylistDetail = (playlistId: bigint, event: React.MouseEvent) => {
    event.stopPropagation();
    if (currentPath !== `/play-list/${playlistId}`) {
      navigator(PLAY_LIST_PATH(playlistId));
    }
    return;
  };

  const onYoutubeUrl = (pageName: string) => {
    if (pageName === "youtube") {
      window.open(`https://www.${pageName}.com`);
    }
    if (pageName === "soundcloud") {
      window.open(`https://www.${pageName}.com`);
    }
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignInClickHandler = () => {
    navigator(SIGN_IN_PATH());
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignUpClickHandler = () => {
    navigator(SIGN_UP_PATH());
  };

  const onSignOutBtnClickHandler = () => {
    if (cookies.accessToken) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      alert("로그아웃 되었습니다.");
      navigator(MAIN_PATH());
    }
  };

  // =============================================================
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
    uploadProfileImageRequest(selectedFile, cookies.accessToken).then(
      uploadProfileImageResponse
    );
  };

  const uploadProfileImageResponse = (
    responseBody: GetUserImageResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    const profileImage = responseBody as GetUserImageResponseDto;
    if (loginUser) {
      setLoginUser({
        ...loginUser,
        profileImage: profileImage.url, // 새 URL로 업데이트
      });
    }
  };

  // ========================================================
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLUListElement>(false);

  const onMenuAction = (index: number) => {
    // 현재 선택된 인덱스가 열려있다면 닫고, 아니면 열기
    // 열어줄 index를 set해줌

    if (openDropdownIndex === index) {
      setIsOpen(false);
      setOpenDropdownIndex(null);
      return;
    }
    // setOpenDropdownIndex(openDropdownIndex === index ? null : index);

    setOpenDropdownIndex(index);
    setIsOpen(true); // 외부 클릭 시 닫히는 기능 추가
  };

  useEffect(() => {
    if (!isOpen && openDropdownIndex !== null) {
      setOpenDropdownIndex(null);
    }
  }, [isOpen]);

  // 시작 ================================= 재생목록 삭제
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

  // 끝 ================================= 재생목록 삭제

  // 시작 ================================= 재생목록 이름 수정
  const [modifyPlaylistId, setModifyPlaylistId] = useState(0);

  const [isModifyPlaylistPopupOpen, setIsModifyPlaylistPopupOpen] =
    useState(false); // 추가 팝업 상태 추가

  const addPlayListInputRef = useRef<HTMLInputElement>(null); // input ref 생성

  //      event handler: 재생목록 추가 버튼 클릭 이벤트 처리 함수      //
  const toggleModifyPlaylistPopup = () => {
    alert("재생목록 추가 실행");

    // 필요한것 : 수정 할 재생목록 id, 수정 할 재생목록 name, 쿠키
    // 1. 클라이언트에서 바꾸려는 name과 기존 name이 일치한지 확인
    // 2. 확인후 이상 없으면 수정 할 재생목록 id, 수정 할 재생목록 name,
    //    쿠키를 가지고 api 요청
    // 3. 응답값 받고 최신화 해주기 (api로 재생목록 다시 불러오기)
  };

  const onHandlePlaylistModify = (modifyPlaylistId: bigint) => {
    // setModifyPlaylistId(modifyPlaylistId);
    setModifyPlaylistId(Number(modifyPlaylistId)); // bigint를 number로 변환
    setIsModifyPlaylistPopupOpen(true);
  };

  return (
    <div className={styles["menu-container"]}>
      {loginUser ? (
        <div className={styles["menu-user-info-box"]}>
          <div
            className={styles["menu-user-info-image"]}
            style={
              loginUser.profileImage
                ? { backgroundImage: `url(${loginUser.profileImage})` }
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
            {loginUser?.email}
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
                      playlistId === (index + 1).toString()
                        ? "#333333"
                        : undefined,

                    color:
                      playlistId === (index + 1).toString()
                        ? "#ffffff"
                        : undefined,
                  }}
                  key={index}
                  onClick={(
                    event: React.MouseEvent<HTMLLIElement, MouseEvent>
                  ) => showPlaylistDetail(playlist.playlistId, event)}
                >
                  {playlist.title}

                  {/* ===========================================*/}
                  {/* btn */}
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
                    {/* 더보기 드롭다운 */}
                    {/* set해준 값과 index가 일치하면 보여줌  */}
                    {/* ul, li */}
                    {openDropdownIndex === index && isOpen && (
                      <ul ref={ref}>
                        <li
                          onClick={() => {
                            // 이름 수정
                            onHandlePlaylistModify(
                              playlistLibrary[index].playlistId
                            ); // 클릭된 음악의 ID를 전달
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
                  {/* ================================================ */}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={styles["main-menu-item3"]}
          onClick={() => onYoutubeUrl("youtube")}
        >
          Youtube
        </div>
        <div
          className={styles["main-menu-item4"]}
          onClick={() => onYoutubeUrl("soundcloud")}
        >
          SoundCloud
        </div>

        <div className={styles["main-menu-item5"]} onClick={testValue}>
          TEST
        </div>

        {/* 재생목록 add 화면 */}
        {isModifyPlaylistPopupOpen && (
          <div className={styles["add-playlist-popup"]}>
            <div className={styles["add-playlist-popup-content"]}>
              <div className={styles["add-playlist-popup-top"]}>
                <h3>Modify Playlist Name</h3>
                <div
                  className={styles["add-playlist-popup-close-btn"]}
                  onClick={() => setIsModifyPlaylistPopupOpen(false)}
                ></div>
              </div>

              <div className={styles["add-playlist-popup-bottom"]}>
                <input
                  value={playlistLibrary[modifyPlaylistId - 1].title}
                  ref={addPlayListInputRef}
                  type="text"
                  placeholder="New playlist name"
                />

                <div
                  className={styles["add-playlist-popup-add-btn"]}
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
