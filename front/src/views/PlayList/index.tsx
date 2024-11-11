import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { getPlaylistMusicReqeust } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import GetPlayListResponseDto from "../../apis/response/PlayList/playlist-library.dto";
import { Form, useParams } from "react-router-dom";
import GetMusciResponseDto from "../../apis/response/Music/get-music.dto";
import Music from "../../types/interface/music.interface";
import useFormatTime from "../../hooks/useFormatTime";
import { useVideoStore } from "../../store/useVideoStore";
import useYoutubeInfo from "../../hooks/useYoutubeInfo";

const PlayList = () => {
  const { playlistId } = useParams();
  const {
    playBarUrl,
    setPlayBarUrl,
    isPlaying,
    setIsPlaying,
    playBarInfo,
    setPlayBarInfo,
  } = useVideoStore();
  const formatTime = useFormatTime();

  const { youtube, setYoutube, getInfo } = useYoutubeInfo("");

  useEffect(() => {
    if (!playlistId) return;
    getPlaylistMusicReqeust(playlistId).then(getPlaylistMusicResponse);
  }, [playlistId]);

  const getPlaylistMusicResponse = (
    responseBody: GetMusciResponseDto | ResponseDto | null
  ) => {
    console.log(responseBody);

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
    console.log("셋팅된 youtube 값 : " + JSON.stringify(youtube));
    console.log("셋팅된 playBarUrl 값 : " + JSON.stringify(playBarUrl));
    // console.log(
    //   "셋팅된 musics[0].url.includes(playBarUrl) 값 : " +
    //     JSON.stringify(musics[0].url.includes(playBarUrl))
    // );
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

      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const [isMusicActionDrop, setIsMusicActionDrop] = useState(false);

  const onMusicAction = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    setIsMusicActionDrop(!isMusicActionDrop);
  };

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
                key={index} // key 추가
                className={
                  playBarUrl && music.url.includes(playBarUrl) // 재생중인 음악 urlId가 선택한 음악 url에 포함되어 있다면
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

                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.title}
                  </div>
                </div>

                <div className={styles["music-info-artist"]}>
                  {music.author}
                </div>
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                <div className={styles["music-info-duration"]}>
                  {formatTime(music.duration)}
                </div>

                <div
                  className={styles["music-info-action-btn"]}
                  onClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => onMusicAction(event)}
                >
                  {isMusicActionDrop && (
                    // ul li로 할까 div로 할까?
                    <ul>
                      <li>dd</li>
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
