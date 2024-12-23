import React, { useEffect, useState } from "react";
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
import { uploadProfileImageRequest } from "../../apis";
import GetUserImageResponseDto from "../../apis/response/user/get-user-new-image-url.dto";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import useOutsideClick from "../../hooks/useOutsideClick";

const Menu = () => {
  const { playlistId } = useParams();
  const [cookies, removeCookie, deleteCookie] = useCookies();

  const { loginUser, setLoginUser } = useLoginUserStore();

  const { playlistLibrary } = usePlaylistStore();
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
    console.log("openDropdownIndex : ", openDropdownIndex);
    console.log("isOpen : ", isOpen);
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
    // console.log("openDropdownIndex : ", openDropdownIndex);
    console.log("index : ", index);
    console.log("openDropdownIndex : ", openDropdownIndex);
    // console.log("isOpen : ", isOpen);
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

                  {/* ========= ==================================*/}
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
                          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                            event.stopPropagation();
                          }}
                        >
                          이름수정
                        </li>
                        <li onClick={() => {}}>삭제</li>
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
      </div>
    </div>
  );
};

export default Menu;
