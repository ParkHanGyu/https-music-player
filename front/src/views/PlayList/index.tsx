import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { getPlaylistMusicReqeust } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { useNavigate, useParams } from "react-router-dom";
import GetMusciResponseDto from "../../apis/response/Music/get-music.dto";
import Music from "../../types/interface/music.interface";
import useFormatTime from "../../hooks/useFormatTime";
import { useVideoStore } from "../../store/useVideo.store";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";
import useOutsideClick from "../../hooks/useOutsideClick";
import useLoginUserStore from "../../store/login-user.store";
import { MAIN_PATH } from "../../constant";

const PlayList = () => {
  const { playlistId } = useParams();
  const {
    playBarUrl,
    setPlayBarUrl,
    setPlayBarInfo,
    setNowPlayingPlaylistID,
    nowPlayingPlaylistID,
    isLoading,
    nowPlayingPlaylist,
    setNowPlayingPlaylist,
  } = useVideoStore();
  const formatTime = useFormatTime();

  const { youtube, getInfo } = useYoutubeInfo("");
  const { loginUser } = useLoginUserStore();
  const navigator = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!loginUser) {
        alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
        navigator(MAIN_PATH());
        return;
      }
      if (playlistId) {
        getPlaylistMusicReqeust(playlistId).then(getPlaylistMusicResponse);
      }
    }
  }, [playlistId, isLoading]);

  const getPlaylistMusicResponse = (
    responseBody: GetMusciResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("데이터 없음");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return false;
    }

    const playListResult = responseBody as GetMusciResponseDto;
    setMusics(playListResult.musicList);
  };

  const [musics, setMusics] = useState<Music[]>([]);

  const testBtn = () => {
    console.log(
      "셋팅된 openDropdownIndex 값 : " + JSON.stringify(openDropdownIndex)
    );
    console.log("셋팅된 isOpen 값 : " + JSON.stringify(isOpen));
    console.log(
      "현재 재생중인 재생목록 음악들 : " + JSON.stringify(nowPlayingPlaylist)
    );
    alert(JSON.stringify(musics));
  };

  useEffect(() => {
    if (youtube.vidUrl !== "-") {
      setPlayBarInfo(youtube);
    }
  }, [youtube]);

  const onPlayMusic = (index: number) => {
    const itemMusicUrl = musics[index].url.match(/(?<=\?v=)[\w-]{11}/);

    if (itemMusicUrl) {
      getInfo(itemMusicUrl[0]);
      setPlayBarUrl(itemMusicUrl[0]);
      setNowPlayingPlaylistID(playlistId);
      setNowPlayingPlaylist(musics);
    }
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const onMusicAction = (index: number) => {
    // 현재 선택된 인덱스가 열려있다면 닫고, 아니면 열기
    // 열어줄 index를 set해줌
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    setIsOpen(true); // 외부 클릭 시 닫히는 기능 추가
  };

  const onHandleMusicEdit = () => {};
  const onHandleMusicDelete = () => {
    alert("삭제 실행");
  };

  // 마우스 외부 클릭 이벤트 커스텀 hook
  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLUListElement>(false);

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdownIndex(null);
    }
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
      </div>
    ); // 로딩 중 표시
  }
  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-wrap-top"]}>
          <div className={styles["main-right"]}>
            <div className={styles["main-music-data-column-box"]}>
              <div className={styles["music-column-number"]} onClick={testBtn}>
                #
              </div>
              <div className={styles["music-column-title"]}>Title</div>
              <div className={styles["music-column-artist"]}>Artist</div>
              <div className={styles["music-column-createdAt"]}>CreatedAt</div>
              <div className={styles["music-column-duration"]}>Duration</div>
              <div className={styles["music-column-action-menu"]}></div>
            </div>

            {musics.map((music, index) => (
              <div
                key={index}
                className={
                  nowPlayingPlaylistID === playlistId &&
                  playBarUrl &&
                  music.url.includes(playBarUrl) // 재생중인 음악 urlId가 선택한 음악 url에 포함되어 있다면
                    ? `${styles["main-music-data-info-box"]} ${styles["music-target"]}`
                    : styles["main-music-data-info-box"]
                }
                onClick={() => onPlayMusic(index)}
              >
                <div className={styles["music-info-number"]}>{index + 1}</div>

                <div className={styles["music-info-image-title-box"]}>
                  <div
                    className={styles["music-info-image"]}
                    style={{
                      backgroundImage: `url(${music.imageUrl})`,
                    }}
                  ></div>

                  {/* 수정을 위해 title div를 input으로 바꿔주기 */}
                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.title}
                  </div>
                </div>

                {/* 수정을 위해 artist div를 input으로 바꿔주기 */}
                <div className={styles["music-info-artist"]}>
                  {music.author}
                </div>
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                <div className={styles["music-info-duration"]}>
                  {formatTime(music.duration)}
                </div>

                {/* ================= 더보기 btn ================ */}
                <div
                  className={styles["music-info-action-btn"]}
                  onClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    event.stopPropagation();
                    onMusicAction(index); // 클릭된 음악의 인덱스를 전달
                  }}
                  style={{
                    display:
                      openDropdownIndex === index && isOpen ? "block" : "",
                  }}
                >
                  {/* 더보기 드롭다운 */}
                  {/* set해준 값과 index가 일치하면 보여줌  */}
                  {openDropdownIndex === index && isOpen && (
                    <ul ref={ref}>
                      <li onClick={onHandleMusicEdit}>정보수정</li>
                      <li
                        onClick={() => {
                          onHandleMusicDelete(); // 클릭된 음악의 인덱스를 전달
                        }}
                      >
                        삭제
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;
