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
  }, []);

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
    console.log("셋팅된 값 : " + JSON.stringify(youtube));
  };

  useEffect(() => {
    setPlayBarInfo(youtube);
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
            </div>

            {musics.map((music, index) => (
              <div
                className={styles["main-music-data-info-box"]}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;
