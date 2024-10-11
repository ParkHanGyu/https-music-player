import React from "react";
import "./style.css";

const Main = () => {
  // const testOnClick = () => {
  //   testApi().then(testResponse);
  // };

  const testResponse = (responseBody: any) => {
    alert(responseBody);
  };
  return (
    <>
      <div className="main-wrap">
        <div className="main-wrap-top">
          <div className="main-left">
            <div className="main-search-box">
              <input className="main-search-input" type="text" />
              <div className="main-search-btn"></div>
            </div>

            <div className="main-menu-box">
              <div className="main-menu-item1">All Tracks</div>
              <div className="main-menu-item2">PlayList</div>
              <div className="main-menu-item3">Youtube</div>
              <div className="main-menu-item4">SoundCloud</div>
            </div>
          </div>
          <div className="main-right">
            <div className="main-music-data-column-box">
              <div className="music-column-number">#</div>
              <div className="music-column-title">Title</div>
              <div className="music-column-artist">Artist</div>
              <div className="music-column-album">Album</div>
              <div className="music-column-duration">Duration</div>
            </div>

            <div className="main-music-data-info-box">
              <div className="music-info-number">1</div>

              <div className="music-info-image-title-box">
                <div className="music-info-image"></div>

                <div className="music-info-title flex-center">제목1</div>
              </div>

              <div className="music-info-artist">아티스트1</div>
              <div className="music-info-album">앨범1</div>
              <div className="music-info-duration">3:33</div>
            </div>

            <div className="main-music-data-info-box">
              <div className="music-info-number">1</div>

              <div className="music-info-image-title-box">
                <div className="music-info-image"></div>

                <div className="music-info-title flex-center">제목1</div>
              </div>

              <div className="music-info-artist">아티스트1</div>
              <div className="music-info-album">앨범1</div>
              <div className="music-info-duration">3:33</div>
            </div>
          </div>
        </div>

        <div className="main-wrap-bottom">
          <div className="main-play-box">
            <div className="main-play-top">
              <div className="main-play-prev-btn"></div>
              <div className="main-play-play-btn"></div>
              <div className="main-play-next-btn"></div>
            </div>
            <div className="main-play-bottom">
              <div className="music-current-time">0:14</div>
              <div className="music-progress-bar-box">
                <div className="music-progress-real-time-bar"></div>
              </div>
              <div className="music-full-time">3:31</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
