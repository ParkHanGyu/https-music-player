import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import {
  musicLikeRankRequest,
  musicLikeRemoveRequest,
  targetMusicLikeStateRequest,
} from "../../apis";
import musicLikeRankResponseDto from "../../apis/response/Music/get-music-like-rank.dto";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import LikeRankMusic from "../../types/interface/like-rank-music.interface";
import { useVideoStore } from "../../store/useVideo.store";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import { useCookies } from "react-cookie";
import useLoginUserStore from "../../store/login-user.store";
import MusicInfoData from "../../types/interface/music-info-data.interface";
import musicLikeStateResponseDto from "../../apis/response/Music/get-music-like-state.dto";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";
import { useNavigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../../constant";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import Music from "../../types/interface/music.interface";
import musicLikeRequestDto from "../../apis/request/music-like-request.dto";
import NoembedMusicInfoData from "../../types/interface/music-info-data.interface";

const LikeRank = () => {
  //      Zustand state : playBar 재생목록 상태      //
  const { musics } = usePlaylistStore();

  //    Zustand state : 메인 화면 검색 url 상태    //
  const { setSearchUrl } = useVideoStore();

  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();

  //    Zustand state : playBar.tsx 관련 상태    //
  const {
    setPlaylistLibrary,
    setNowRandomPlaylist,
    setNowPlayingPlaylist,
    setNowPlayingPlaylistID,
    setNowRandomPlaylistID,
  } = usePlaylistStore();
  //    Zustand state : playBar.tsx 재생 상태    //
  const { isPlaying, setIsPlaying } = usePlayerOptionStore();
  const navigator = useNavigate();
  const [cookies] = useCookies();

  const { playBarUrl, setPlayBarUrl, playBarInfo, setPlayBarInfo } =
    useVideoStore();

  useEffect(() => {
    musicLikeRankRequest(cookies.accessToken).then(musicLikeRankResponse);
  }, []);

  const [likeRankMusic, setLikeRankMusic] = useState<LikeRankMusic[]>([]);

  const musicLikeRankResponse = (
    responseBody: musicLikeRankResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const musicLikeRankResult = responseBody as musicLikeRankResponseDto;
    console.log("59줄 : ", JSON.stringify(musicLikeRankResult, null, 2));

    setLikeRankMusic(musicLikeRankResult.musicList);
  };

  //      event handler : 음악 정보 영역 클릭 이벤트 함수       //
  const handleMusicInfoClick = (musicUrl: string) => {
    // window.open(musicUrl, "_blank");
    setSearchUrl(musicUrl);
  };

  //      event handler: 재생 버튼 클릭 이벤트 처리 함수       //
  const playHandleClick = async (targetLikeMusic: LikeRankMusic) => {
    if (playBarUrl === targetLikeMusic.musicInfo.basicInfo.url) {
      setPlayBarUrl("");
    }

    let musicWithLike: MusicInfoAndLikeData;
    const musicInfoData: NoembedMusicInfoData = {
      url: targetLikeMusic.musicInfo.basicInfo.url,
      author: targetLikeMusic.musicInfo.basicInfo.author,
      imageUrl: targetLikeMusic.musicInfo.basicInfo.imageUrl,
      title: targetLikeMusic.musicInfo.basicInfo.title,
    };

    // 로그인 상태라면
    if (loginUserInfo) {
      const responseBody = await targetMusicLikeStateRequest(
        targetLikeMusic.musicInfo.basicInfo.url,
        cookies.accessToken
      );

      const playListResult = responseBody as musicLikeStateResponseDto;
      musicWithLike = {
        musicInfo: musicInfoData,
        like: playListResult.targetLikeState,
      };

      // 로그인 상태가 아니라면
    } else {
      musicWithLike = {
        musicInfo: musicInfoData,
        like: false,
      };
    }

    setPlayBarInfo(musicWithLike);

    setTimeout(() => {
      setPlayBarUrl(targetLikeMusic.musicInfo.basicInfo.url);
    }, 100);

    setNowRandomPlaylist([]);
    setNowPlayingPlaylist([]);
    setNowPlayingPlaylistID("");
    setNowRandomPlaylistID("");

    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  //      state:  url 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      state:  재생목록 팝업 상태 상태        //
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  const [targetInfoData, setTargetInfoData] = useState<NoembedMusicInfoData>({
    url: "",
    author: "",
    imageUrl: "",
    title: "",
  });

  //      event handler:  재생목록 추가 버튼 클릭 이벤트 함수       //
  const togglePlaylistPopup = (music: LikeRankMusic) => {
    if (!loginUserInfo) {
      alert("로그인 이후 추가해주세요.");
      navigator(SIGN_IN_PATH());
      return;
    }
    const targetMusicInfo: NoembedMusicInfoData = {
      url: music.musicInfo.basicInfo.url,
      author: music.musicInfo.basicInfo.author,
      imageUrl: music.musicInfo.basicInfo.imageUrl,
      title: music.musicInfo.basicInfo.title,
    };

    setTargetInfoData(targetMusicInfo);
    setInfoDuration(music.musicInfo.duration);
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  //      state:  체크 상태 관리 상태        //
  const [checkedMusicIds, setCheckedMusicIds] = useState<number[]>([]);

  //      event handler:  체크박스 클릭 함수       //
  const handleCheck = (musicId: number) => {
    setCheckedMusicIds(
      (prev) =>
        prev.includes(musicId)
          ? prev.filter((id) => id !== musicId) // 이미 있으면 제거
          : [...prev, musicId] // 없으면 추가
    );
  };

  //      event handler:  전체 재생 버튼 클릭 함수       //
  const handlePlaySelected = () => {
    let targetMusic = likeRankMusic;

    // 체크한게 있다면
    if (checkedMusicIds.length > 0) {
      targetMusic = likeRankMusic.filter((music) =>
        checkedMusicIds.includes(Number(music.musicInfo.musicId))
      );
    }

    // Music[]타입에 맞게 set
    const selectedMusic: Music[] = targetMusic.map((music) => ({
      basicInfo: {
        url: music.musicInfo.basicInfo.url,
        title: music.musicInfo.basicInfo.title,
        imageUrl: music.musicInfo.basicInfo.imageUrl,
        author: music.musicInfo.basicInfo.author,
      },

      musicId: music.musicInfo.musicId,
      duration: music.musicInfo.duration,
      createdAt: music.musicInfo.createdAt,
      like: music.musicInfo.like,
    }));

    if (playBarUrl === selectedMusic[0].basicInfo.url) {
      setPlayBarUrl("");
    }

    // 첫번째 재생할 노래 info 데이터 준비
    const item1info: MusicInfoAndLikeData = {
      musicInfo: {
        url: selectedMusic[0].basicInfo.url,
        author: selectedMusic[0].basicInfo.author,
        imageUrl: selectedMusic[0].basicInfo.imageUrl,
        title: selectedMusic[0].basicInfo.title,
      },
      like: selectedMusic[0].like,
    };

    setPlayBarInfo(item1info);
    setNowPlayingPlaylist(selectedMusic);
    setNowRandomPlaylist(selectedMusic);
    setNowRandomPlaylistID("");
    setNowPlayingPlaylistID("");
    setTimeout(() => {
      setPlayBarUrl(selectedMusic[0].basicInfo.url);
    }, 100);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-container"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div
              className={styles["music-column-all-play"]}
              onClick={handlePlaySelected}
            ></div>

            <div className={styles["music-column-number"]}>Rank</div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-like"]}>Like</div>
            <div className={styles["music-column-play"]}>Play</div>
            <div className={styles["music-column-add"]}>Add</div>
            {/* <div className={styles["music-column-action-menu"]}></div> */}
          </div>

          <div className={styles["main-music-container"]}>
            {likeRankMusic.map((music, index) => (
              <div key={index} className={styles["main-music-data-info-box"]}>
                <div className={styles["music-info-play-check"]}>
                  <input
                    type="checkbox"
                    checked={checkedMusicIds.includes(
                      Number(music.musicInfo.musicId)
                    )}
                    onChange={() =>
                      handleCheck(Number(music.musicInfo.musicId))
                    }
                  />
                </div>

                {/* rank */}
                <div className={styles["music-info-number"]}>{index + 1}</div>
                {/* <div className={styles["music-info-rank-move"]}></div> */}
                {/* image + title */}
                <div
                  className={styles["music-info-image-title-box"]}
                  onClick={() =>
                    handleMusicInfoClick(music.musicInfo.basicInfo.url)
                  }
                >
                  <div
                    className={styles["music-info-image"]}
                    style={{
                      backgroundImage: `url(${music.musicInfo.basicInfo.imageUrl})`,
                    }}
                  ></div>
                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.musicInfo.basicInfo.title}
                  </div>
                </div>

                {/* author */}
                <div className={styles["music-info-artist"]}>
                  {music.musicInfo.basicInfo.author}
                </div>
                {/* At */}
                <div className={styles["music-info-createdAt"]}>
                  {music.musicInfo.createdAt.split("T")[0]}
                </div>
                {/* like */}
                <div className={styles["music-info-like"]}>
                  <div
                    className={`${styles["music-info-like-imge"]} ${
                      music.musicInfo.like ? styles["like-true"] : undefined
                    }`}
                    // onClick={()=>handleMusicLikeClick(music)}
                  ></div>
                  <div className={styles["music-info-like-count"]}>
                    {music.likeCount}
                  </div>
                </div>

                {/* play */}
                <div className={styles["music-info-play"]}>
                  <div
                    className={styles["music-info-play-imge"]}
                    onClick={() => playHandleClick(music)}
                  ></div>
                </div>

                {/* 재생목록 추가 */}
                <div className={styles["music-info-add"]}>
                  <div
                    className={styles["music-info-add-imge"]}
                    onClick={() => togglePlaylistPopup(music)}
                  ></div>
                </div>

                {/* ================= 더보기 btn ================ */}
                <div className={styles["music-info-action-btn"]}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* =======================================재생목록 팝업 */}
      {playlistPopupOpen && (
        <PlaylistLibrary
          infoData={targetInfoData}
          infoDuration={infoDuration}
          playlistPopupOpen={playlistPopupOpen}
          setPlaylistPopupOpen={setPlaylistPopupOpen}
        />
      )}
    </>
  );
};

export default LikeRank;
