import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { deleteMusic, getPlaylistMusicReqeust } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { useNavigate, useParams } from "react-router-dom";
import GetMusciResponseDto from "../../apis/response/Music/get-music.dto";
import Music from "../../types/interface/music.interface";
import useFormatTime from "../../hooks/useFormatTime";
import { useVideoStore } from "../../store/useVideo.store";
import useOutsideClick from "../../hooks/useOutsideClick";
import useLoginUserStore from "../../store/login-user.store";
import { MAIN_PATH } from "../../constant";
import { useCookies } from "react-cookie";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import useMediaInfo from "../../hooks/testInfo";

const PlayList = () => {
  const [cookies] = useCookies();
  const { playlistId } = useParams();
  const { playBarUrl, setPlayBarUrl, setPlayBarInfo, isLoading, setIsLoading } =
    useVideoStore();

  const {
    nowPlayingPlaylist,
    setNowPlayingPlaylist,
    nowPlayingPlaylistID,
    setNowPlayingPlaylistID,
    setNowRandomPlaylist,
    setNowRandomPlaylistID,
  } = usePlaylistStore();
  const formatTime = useFormatTime();
  const [infoDuration, setInfoDuration] = useState<number>(0);

  const { infoData: copyInfoData, setMusicInfo: setCopyInfoData } =
    useMediaInfo("");
  const { infoData, setMusicInfo } = useMediaInfo("");

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
    console.log(JSON.stringify(musics));
    // console.log("nowPlayingPlaylistID : ", nowPlayingPlaylistID);
    console.log("playBarUrl : ", playBarUrl);
    console.log("nowPlayingPlaylistID : ", nowPlayingPlaylistID);
    console.log("playlistId : ", playlistId);
  };

  useEffect(() => {
    if (infoData.vidUrl !== "-") {
      console.log("setPlayBarInfo실행. set해주는 값 : ", infoData);
      setPlayBarInfo(infoData);
    }
  }, [infoData]);

  const onPlayMusic = (index: number) => {
    if (!cookies.accessToken) {
      alert("유저 정보가 없습니다. 다시 로그인 해주세요.");
      navigator(MAIN_PATH());
      return;
    }

    const itemMusicUrl = musics[index].url;
    setMusicInfo(itemMusicUrl);

    // 다른 재생목록의 같은 노래일 경우 같은 노래를 틀어야 하니 빈문자열로 set
    if (itemMusicUrl === playBarUrl && nowPlayingPlaylistID !== playlistId) {
      setPlayBarUrl("");
    }

    //useEffect를 너무 많이 사용하면 복잡하기 때문에 setTimeout으로 대체
    // useEffect 또는 setTimeout을 사용하지 않으면 비동기상태이기 때문에 setPlayBarUrl("");을 해줄 이유가 없음
    setTimeout(() => {
      setPlayBarUrl(itemMusicUrl);
      setNowPlayingPlaylistID(playlistId);
      setNowPlayingPlaylist(musics);
      setNowRandomPlaylistID(playlistId);
      setNowRandomPlaylist(musics);
    }, 100); // 다시 설정
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

  const onHandleMusicCopy = (index: number) => {
    setOpenDropdownIndex(null);
    setPlaylistPopupOpen(!playlistPopupOpen);
    const itemMusicUrl = musics[index].url;

    if (itemMusicUrl) {
      setCopyInfoData(itemMusicUrl);
      setInfoDuration(musics[index].duration);
    }
  };

  const onHandleMusicDelete = (musicId: bigint) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (isConfirmed) {
      setOpenDropdownIndex(null);
      setIsLoading(true);
      deleteMusic(musicId, cookies.accessToken).then((responseBody) =>
        deleteMusicResponse(responseBody, musicId)
      );
    }
  };
  const deleteMusicResponse = (
    responseBody: ResponseDto | null,
    musicId: bigint
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

    // 이전 playlist에서 삭제하는 노래의 index값 (삭제 이후 다음 노래로 바꾸기 위해 구해둠)
    const deleteMusicIndex = nowPlayingPlaylist.findIndex(
      (item) => item.musicId === musicId
    );

    // 이전 nowPlayingPlaylist의 개수와 삭제하는 음악의 index + 1 과 같으면 true
    // 마지막 노래인지 true / false
    const lastIndexBoolean = nowPlayingPlaylist.length === deleteMusicIndex + 1;

    // 삭제하는 음악의 url
    const deleteMusicUrl =
      nowPlayingPlaylist.find((item) => item.musicId === musicId)?.url || null;

    // const previounNowPlayingPlaylist = nowPlayingPlaylist

    console.log("1");
    console.log(musics);

    setIsLoading(false); // 이때 useEffect로 music을 최신화
    console.log("2");
    console.log(musics);

    // 삭제이후 현재 보고있는 재생목록과 playBar에 재생중인 재생목록의 데이터를 일치화
    if (
      playlistId === nowPlayingPlaylistID &&
      musics.length !== nowPlayingPlaylist.length
    ) {
      console.log("3");

      setNowPlayingPlaylist(musics);
      setNowRandomPlaylist(musics);
      //       if (
      //         // 새로 받아온 음악의 노래개수 <=
      //         playBarUrl === deleteMusicUrl
      //  &&
      //         lastIndexBoolean &&
      //         !musics.some((item) => item.url === playBarUrl)
      //       ) {
      //         // 삭제한게 마지막곡이면 첫번째곡으로
      //         console.log("마지막곡이므로 처음곡 재생");
      //         setMusicInfo(musics[0].url);
      //         setPlayBarUrl(musics[0].url);

      //         // 마지막 노래가 아니고 && 재생중인 노래가 새로 받은 재생목록에 없을 경우
      //       } else if (
      //         !lastIndexBoolean &&
      //         !musics.some((item) => item.url === playBarUrl &&
      //         playBarUrl === deleteMusicUrl
      //       )
      //       ) {
      //         // 다음 노래를 set
      //         console.log("다음 노래 재생");
      //         setMusicInfo(musics[deleteMusicIndex].url);
      //         setPlayBarUrl(musics[deleteMusicIndex].url);
      //       }

      if (
        !musics.some(
          (item) => item.url === playBarUrl && playBarUrl === deleteMusicUrl
        )
      ) {
        if (lastIndexBoolean) {
          console.log("마지막곡이므로 처음곡 재생");
          setMusicInfo(musics[0].url);
          setPlayBarUrl(musics[0].url);
        }
        if (!lastIndexBoolean) {
          console.log("다음 노래 재생");
          setMusicInfo(musics[deleteMusicIndex].url);
          setPlayBarUrl(musics[deleteMusicIndex].url);
        }
      }
    }
  };
  useEffect(() => {
    console.log("music 최신화");
  }, [musics]);
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  // 마우스 외부 클릭 이벤트 커스텀 hook
  const { isOpen, setIsOpen, ref } = useOutsideClick<HTMLUListElement>(false);

  useEffect(() => {
    // alert("PlayList3");

    if (!isOpen) {
      setOpenDropdownIndex(null);
    }
  }, [isOpen]);
  const homeClickHandler = () => {
    navigator(MAIN_PATH());
  };

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

            {Array.isArray(musics) && musics.length === 0 && (
              <div
                className={styles["music-item-undefined"]}
                onClick={homeClickHandler}
              >
                {"재생목록이 비어있습니다. 음악을 추가해주세요."}
              </div>
            )}

            {musics.map((music, index) => (
              <div
                key={index}
                className={
                  nowPlayingPlaylistID === playlistId &&
                  playBarUrl &&
                  music.url.includes(playBarUrl)
                    ? `${styles["main-music-data-info-box"]} ${styles["music-target"]}`
                    : styles["main-music-data-info-box"]
                }
                style={{
                  cursor: playlistPopupOpen ? "" : "pointer",
                }}
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
                      <li
                        onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                          event.stopPropagation();
                          onHandleMusicCopy(index); // 클릭된 음악의 인덱스를 전달
                        }}
                      >
                        음악복사
                      </li>
                      <li
                        onClick={() => {
                          // 삭제
                          onHandleMusicDelete(musics[index].musicId); // 클릭된 음악의 인덱스를 전달
                        }}
                      >
                        삭제
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {playlistPopupOpen && (
              <PlaylistLibrary
                infoData={copyInfoData}
                infoDuration={infoDuration}
                playlistPopupOpen={playlistPopupOpen}
                setPlaylistPopupOpen={setPlaylistPopupOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;
