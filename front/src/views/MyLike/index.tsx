import { useEffect, useState } from "react";
import styles from "./style.module.css";
import PlaylistLibrary from "../../layouts/PlaylistLibrary";
import { useCookies } from "react-cookie";
import { musicLikeRemoveRequest, myMusicLikeRequest } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import myMusicLikeResponseDto from "../../apis/response/Music/get-my-music-like.dto";
import { ResponseUtil } from "../../utils";
import MyLikeMusic from "../../types/interface/my-like-music.interface";
import useLoginUserStore from "../../store/login-user.store";
import { MusicInfoData } from "../../types/interface/music-info-data.interface";
import { SIGN_IN_PATH } from "../../constant";
import { useNavigate } from "react-router-dom";

const MyLike = () => {
  //      Zustand state : 로그인 유저 정보 상태      //
  const { loginUserInfo } = useLoginUserStore();
  const [cookies] = useCookies();
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);

  const [myLikeMusic, setMyLikeMusic] = useState<MyLikeMusic[]>([]);
  const navigator = useNavigate();

  const [targetInfoData, setTargetInfoData] = useState<MusicInfoData>({
    vidUrl: "",
    author: "",
    thumb: "",
    vidTitle: "",
  });

  //      state:  url 시간 상태        //
  const [infoDuration, setInfoDuration] = useState<number>(0);

  //      event handler:  재생목록 추가 버튼 클릭 이벤트 함수       //
  const togglePlaylistPopup = (music: MyLikeMusic) => {
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
    console.log("59줄 : ", JSON.stringify(musicLikeRankResult, null, 2));

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

    const newMyLikeMusic = myLikeMusic.filter((item) => item.url !== musicUrl);

    setMyLikeMusic(newMyLikeMusic);
  };

  return (
    <>
      <div className={styles["main-wrap"]}>
        <div className={styles["main-container"]}>
          <div className={styles["main-music-data-column-box"]}>
            <div
              className={styles["music-column-all-play"]}
              // onClick={handlePlaySelected}
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
                    // checked={checkedMusicIds.includes(Number(music.musicId))}
                    // onChange={() => handleCheck(Number(music.musicId))}
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
                    onClick={() => handleMusicLikeClick(music.url)}
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
