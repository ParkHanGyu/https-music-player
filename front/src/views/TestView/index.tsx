import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "./style.css";

const TestView = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audSrc = "../../assets/myAudio.mp3";

  useEffect(() => {
    timeAudio();
  }, [audSrc]);

  const timeAudio = () => {
    // 원본 오디오 선택
    const crtAudio: any = $("#audio")[0];

    // 전체시간 표시
    $("#audio").on("loadeddata", function () {
      const totTime = $(".duration");
      const duration = crtAudio.duration || 0;

      //음원 총 재생시간 구하기
      const min = Math.floor(duration / 60);
      const sec = Math.floor(duration % 60);
      const totMin = min.toString().padStart(2, "0");
      const totSec = sec.toString().padStart(2, "0");
      totTime.text(`${totMin} : ${totSec}`);
    });

    // 현재시간 표시
    $("#audio").on("timeupdate", function () {
      const playTime = $(".current");
      const progress = $(".bar");
      let ctTime = crtAudio.currentTIme;
      const duration = crtAudio.duration || 0;

      // 프로그레스 바 업데이트
      const progBar = (ctTime / duration) * 100 + "%";
      progress.css("width", `${progBar}`);

      let min = Math.floor(ctTime / 60);
      let sec = Math.floor(ctTime % 60);
      let ctMin = min.toString().padStart(2, "0");
      let ctSec = sec.toString().padStart(2, "0");
      playTime.text(`${ctMin} : ${ctSec}`);
    });
  };

  return (
    <>
      <div className="progress">
        <div className="bar">
          <span className="pin"></span>
          <audio ref={audioRef} src={audSrc} id="audio"></audio>
        </div>
      </div>
    </>
  );
};

export default TestView;
