import { useState } from "react";
import { YoutubeInfo } from "../types/interface/youtube.interface";

const noEmbed = "https://noembed.com/embed?url=";
const urlForm = "https://www.youtube.com/watch?v=";

// 커스텀 훅: useYoutubeInfo
const useYoutubeInfo = (defaultImage: string) => {
  const [infoData, setInfoData] = useState<YoutubeInfo>({
    vidUrl: "-",
    author: "-",
    thumb: defaultImage,
    vidTitle: "-",
  });

  const setMusicInfo = (id: string) => {
    const fullUrl = `${noEmbed}${urlForm}${id}`;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        const { url, author_name, thumbnail_url, title } = data;
        setInfoData({
          vidUrl: url || null,
          author: author_name || null,
          thumb: thumbnail_url || null,
          vidTitle: title || null,
        });
      });
  };

  const resetYoutubeInfo = () => {
    setInfoData({
      vidUrl: "-",
      author: "-",
      thumb: defaultImage, // 기본 이미지 설정
      vidTitle: "-",
    });
  };

  // youtube 상태, reset 함수, getInfo 함수 반환
  return {
    infoData,
    setInfoData,
    setMusicInfo,
    defaultImage,
    resetYoutubeInfo,
  };
};

export default useYoutubeInfo;
