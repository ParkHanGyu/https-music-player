import { useEffect, useState } from "react";
import styles from "./style.module.css";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import { useCookies } from "react-cookie";
import { musicLikeRemoveRequest, myMusicLikeRequest } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import myMusicLikeResponseDto from "../../apis/response/Music/get-my-music-like.dto";
import { ResponseUtil } from "../../utils";
import useLoginUserStore from "../../store/login-user.store";
import MusicInfoData from "../../types/interface/music-info-data.interface";
import { SIGN_IN_PATH } from "../../constant";
import { useNavigate } from "react-router-dom";
import Music from "../../types/interface/music.interface";
import NoembedMusicInfoData from "../../types/interface/music-info-data.interface";
import { useVideoStore } from "../../store/useVideo.store";
import MusicInfoAndLikeData from "../../types/interface/music-info-and-like.interface";
import { usePlaylistStore } from "../../store/usePlaylist.store";
import { usePlayerOptionStore } from "../../store/usePlayerOptions.store";

const MyLike = () => {
  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();
  const [cookies] = useCookies();
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  const [myLikeMusic, setMyLikeMusic] = useState<Music[]>([]);
  const navigator = useNavigate();

  const { playBarUrl, setPlayBarUrl, playBarInfo, setPlayBarInfo } =
    useVideoStore();

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

  const [targetInfoData, setTargetInfoData] = useState<NoembedMusicInfoData>({
    url: "",
    author: "",
    imageUrl: "",
    title: "",
  });

  //      state:  url 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      event handler:  재생목록 추가 버튼 클릭 이벤트 함수       //
  const togglePlaylistPopup = (music: Music) => {
    if (!loginUserInfo) {
      alert("로그인 이후 추가해주세요.");
      navigator(SIGN_IN_PATH());
      return;
    }
    const targetMusicInfo: NoembedMusicInfoData = {
      url: music.basicInfo.url,
      author: music.basicInfo.author,
      imageUrl: music.basicInfo.imageUrl,
      title: music.basicInfo.title,
    };

    setTargetInfoData(targetMusicInfo);
    setInfoDuration(music.duration);
    setPlaylistPopupOpen(!playlistPopupOpen);
  };

  // useEffect
  useEffect(() => {
    myMusicLikeRequest(cookies.accessToken).then(myMusicLikeResponse);
  }, []);

  const myMusicLikeResponse = (
    responseBody: myMusicLikeResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }
    const musicLikeRankResult = responseBody as myMusicLikeResponseDto;
    console.log("66줄 : ", JSON.stringify(musicLikeRankResult, null, 2));

    setMyLikeMusic(musicLikeRankResult.musicList);
  };

  const handleMusicLikeClick = (musicUrl: string) => {
    if (!loginUserInfo) {
      console.log("로그인 해주세요");
      return;
    }

    musicLikeRemoveRequest(musicUrl, cookies.accessToken).then((responseBody) =>
      musicLikeRemoveResponse(responseBody, musicUrl)
    );
  };

  const musicLikeRemoveResponse = (
    responseBody: ResponseDto | null,
    musicUrl: string
  ) => {
    if (!ResponseUtil(responseBody)) {
      return;
    }

    const newMyLikeMusic = myLikeMusic.filter(
      (item) => item.basicInfo.url !== musicUrl
    );

    setMyLikeMusic(newMyLikeMusic);
  };

  //      event handler:  전체 재생 버튼 클릭 함수       //
  const handlePlaySelected = () => {
    let targetMusic = myLikeMusic;

    // 체크한게 있다면
    if (checkedMusicIds.length > 0) {
      targetMusic = myLikeMusic.filter((music) =>
        checkedMusicIds.includes(Number(music.musicId))
      );
    }

    // Music[]타입에 맞게 set
    const selectedMusic: Music[] = targetMusic.map((music) => ({
      basicInfo: {
        url: music.basicInfo.url,
        title: music.basicInfo.title,
        imageUrl: music.basicInfo.imageUrl,
        author: music.basicInfo.author,
      },

      musicId: music.musicId,
      duration: music.duration,
      createdAt: music.createdAt,
      like: music.like,
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

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-container"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div
              className={styles["music-column-all-play"]}
              onClick={handlePlaySelected}
            ></div>

            <div className={styles["music-column-number"]}>#</div>
            <div className={styles["music-column-title"]}>Title</div>
            <div className={styles["music-column-artist"]}>Artist</div>
            <div className={styles["music-column-createdAt"]}>CreatedAt</div>
            <div className={styles["music-column-like"]}>Like</div>
            <div className={styles["music-column-play"]}>Play</div>
            <div className={styles["music-column-add"]}>Add</div>
            {/* <div className={styles["music-column-action-menu"]}></div> */}
          </div>

          <div className={styles["main-music-container"]}>
            {myLikeMusic.map((music, index) => (
              <div key={index} className={styles["main-music-data-info-box"]}>
                <div className={styles["music-info-play-check"]}>
                  <input
                    type="checkbox"
                    checked={checkedMusicIds.includes(Number(music.musicId))}
                    onChange={() => handleCheck(Number(music.musicId))}
                  />
                </div>

                {/* 순서 */}
                <div className={styles["music-info-number"]}>{index + 1}</div>
                {/* <div className={styles["music-info-rank-move"]}></div> */}
                {/* image + title */}
                <div
                  className={styles["music-info-image-title-box"]}
                  // onClick={() => handleMusicInfoClick(music.url)}
                >
                  <div
                    className={styles["music-info-image"]}
                    style={{
                      backgroundImage: `url(${music.basicInfo.imageUrl})`,
                    }}
                  ></div>
                  <div
                    className={`${styles["music-info-title"]} ${styles["flex-center"]}`}
                  >
                    {music.basicInfo.title}
                  </div>
                </div>

                {/* author */}
                <div className={styles["music-info-artist"]}>
                  {music.basicInfo.author}
                </div>
                {/* At */}
                <div className={styles["music-info-createdAt"]}>
                  {music.createdAt.split("T")[0]}
                </div>
                {/* like */}
                <div className={styles["music-info-like"]}>
                  <div
                    className={`${styles["music-info-like-imge"]} ${
                      music.like ? styles["like-true"] : undefined
                    }`}
                    onClick={() => handleMusicLikeClick(music.basicInfo.url)}
                  ></div>
                  <div className={styles["music-info-like-count"]}></div>
                </div>

                {/* play */}
                <div className={styles["music-info-play"]}>
                  <div
                    className={styles["music-info-play-imge"]}
                    // onClick={() => playHandleClick(music)}
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
      {/* =======================================재생목록 add 팝업 */}
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

export default MyLike;
