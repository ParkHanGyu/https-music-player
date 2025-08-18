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
    if (playBarUrl === targetLikeMusic.url) {
      setPlayBarUrl("");
    }

    let musicWithLike: MusicInfoAndLikeData;
    const musicInfoData: MusicInfoData = {
      vidUrl: targetLikeMusic.url,
      author: targetLikeMusic.author,
      thumb: targetLikeMusic.imageUrl,
      vidTitle: targetLikeMusic.title,
    };

    // 로그인 상태라면
    if (loginUserInfo) {
      const responseBody = await targetMusicLikeStateRequest(
        targetLikeMusic.url,
        cookies.accessToken
      );

      const playListResult = responseBody as musicLikeStateResponseDto;
      musicWithLike = {
        ...musicInfoData,
        like: playListResult.targetLikeState,
      };

      // 로그인 상태가 아니라면
    } else {
      musicWithLike = {
        ...musicInfoData,
        like: false,
      };
    }

    setPlayBarInfo(musicWithLike);

    setTimeout(() => {
      setPlayBarUrl(targetLikeMusic.url);
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

  const [targetInfoData, setTargetInfoData] = useState<MusicInfoData>({
    vidUrl: "",
    author: "",
    thumb: "",
    vidTitle: "",
  });

  //      event handler:  재생목록 추가 버튼 클릭 이벤트 함수       //
  const togglePlaylistPopup = (music: LikeRankMusic) => {
    if (!loginUserInfo) {
      alert("로그인 이후 추가해주세요.");
      navigator(SIGN_IN_PATH());
      return;
    }
    const targetMusicInfo: MusicInfoData = {
      vidUrl: music.url,
      author: music.author,
      thumb: music.imageUrl,
      vidTitle: music.title,
    };

    setTargetInfoData(targetMusicInfo);
    setInfoDuration(music.duration);
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
        checkedMusicIds.includes(Number(music.musicId))
      );
    }

    // Music[]타입에 맞게 set
    const selectedMusic: Music[] = targetMusic.map((music) => ({
      musicId: music.musicId,
      title: music.title,
      author: music.author,
      duration: music.duration,
      url: music.url,
      imageUrl: music.imageUrl,
      createdAt: music.createdAt,
      like: music.liked,
    }));

    if (playBarUrl === selectedMusic[0].url) {
      setPlayBarUrl("");
    }

    // 첫번째 재생할 노래 info 데이터 준비
    const item1info: MusicInfoAndLikeData = {
      vidUrl: selectedMusic[0].url,
      author: selectedMusic[0].author,
      thumb: selectedMusic[0].imageUrl,
      vidTitle: selectedMusic[0].title,
      like: selectedMusic[0].like,
    };

    setPlayBarInfo(item1info);
    setNowPlayingPlaylist(selectedMusic);
    setNowRandomPlaylist(selectedMusic);
    setNowRandomPlaylistID("");
    setNowPlayingPlaylistID("");
    setTimeout(() => {
      setPlayBarUrl(selectedMusic[0].url);
    }, 100);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  // const handleMusicLikeClick = (music: LikeRankMusic) => {
  //     if (!loginUserInfo) {
  //       console.log("로그인 해주세요");
  //       return;
  //     }

  //         const requestBody: musicLikeRequestDto = {
  //           musicInfoData: {
  //              vidUrl: music.url ,
  // author: music.author ,
  // thumb: music.imageUrl ,
  // vidTitle: music.title
  //           },

  //           infoDuration: music.duration,
  //         };

  //     // 해당 아이템의 like가 false라면
  //     if (!music.liked) {
  //         console.log("like add 실행");
  //         console.log(
  //           "서버에 보내는 데이터 requestBody : ",
  //           JSON.stringify(requestBody, null, 2)
  //         );

  //         musicLikeAddRequest(requestBody, cookies.accessToken).then(
  //           musicLikeAddResponse
  //         );

  //              // 해당 아이템의 like가 true라면

  //       } else if (playBarInfo?.like !== undefined && playBarInfo?.like) {
  //         console.log("remove 실행");
  //         musicLikeRemoveRequest(playBarUrl, cookies.accessToken).then(
  //           musicLikeRemoveResponse
  //         );
  //       }

  //     musicLikeRemoveRequest(musicUrl, cookies.accessToken).then((responseBody) =>
  //       musicLikeRemoveResponse(responseBody, musicUrl)
  //     );
  //   };

  // const musicLikeRemoveResponse = (
  //     responseBody: ResponseDto | null,
  //     musicUrl: string
  //   ) => {
  //     if (!ResponseUtil(responseBody)) {
  //       return;
  //     }

  //     const newMyLikeMusic = myLikeMusic.filter((item) => item.url !== musicUrl);

  //     setMyLikeMusic(newMyLikeMusic);
  //   };

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
                    checked={checkedMusicIds.includes(Number(music.musicId))}
                    onChange={() => handleCheck(Number(music.musicId))}
                  />
                </div>

                {/* rank */}
                <div className={styles["music-info-number"]}>{index + 1}</div>
                {/* <div className={styles["music-info-rank-move"]}></div> */}
                {/* image + title */}
                <div
                  className={styles["music-info-image-title-box"]}
                  onClick={() => handleMusicInfoClick(music.url)}
                >
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

                {/* author */}
                <div className={styles["music-info-artist"]}>
                  {music.author}
                </div>
                {/* At */}
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                {/* like */}
                <div className={styles["music-info-like"]}>
                  <div
                    className={`${styles["music-info-like-imge"]} ${
                      music.liked ? styles["like-true"] : undefined
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
