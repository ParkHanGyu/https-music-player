import React, { useState } from "react";
import styles from "./style.module.css";
import { useVideoStore } from "../../store/useVideo.store";
import useLoginUserStore from "../../store/login-user.store";
import { useNavigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../../constant";

interface Playlist {
  playlistId: string;
  title: string;
}

interface PlaylistLibraryProps {
  playlistPopupOpen: boolean;
  setPlaylistPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlaylistLibrary: React.FC<PlaylistLibraryProps> = ({
  playlistPopupOpen,
  setPlaylistPopupOpen,
}) => {
  const { urlId, setUrlId, setPlayBarUrl, setPlayBarInfo } = useVideoStore();
  const { loginUser } = useLoginUserStore();
  const navigator = useNavigate();

  return (
    <></>
    // <div className={styles["playlist-popup"]}>
    //   <div className={styles["playlist-popup-content"]}>
    //     <div className={styles["playlist-popup-top"]}>
    //       <h3>Select Playlist</h3>
    //       <div
    //         className={styles["playlist-popup-close"]}
    //         onClick={() => setPlaylistPopupOpen(!playlistPopupOpen)}
    //       ></div>
    //     </div>

    //     <div className={styles["playlist-popup-center"]}>
    //       <ul>
    //         {playlistLibrary.map((playlist, index) => (
    //           <li
    //             key={index}
    //             onClick={() =>
    //               toggleAddMusicToPlaylist({
    //                 youtube: infoData,
    //                 infoDuration: infoDuration,
    //                 playlistId: playlist.playlistId,
    //               })
    //             }
    //           >
    //             {playlist.title}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>

    //     <div className={styles["playlist-popup-bottom"]}>
    //       <div
    //         className={styles["playlist-popup-add"]}
    //         onClick={craetePlayList}
    //       ></div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default PlaylistLibrary;
