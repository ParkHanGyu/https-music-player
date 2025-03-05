import { useState } from "react";
import { MusicInfoData } from "../types/interface/music-info-data.interface";

const noEmbed = "https://noembed.com/embed?url=";
// 커스텀 훅: useMediaInfo (YouTube, SoundCloud 모두 지원)
const useMediaInfo = (defaultImage: string) => {
  const [infoData, setInfoData] = useState<MusicInfoData>({
    vidUrl: "-",
    author: "-",
    thumb: defaultImage,
    vidTitle: "-",
  });

  const setMusicInfo = (
    url: string,
    callback?: (data: MusicInfoData) => void
  ) => {
    const fullUrl = `${noEmbed}${url}`;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        const { url, author_name, thumbnail_url, title } = data;

        const newInfoData = {
          vidUrl: url || "-",
          author: author_name || "-",
          thumb: thumbnail_url || defaultImage,
          vidTitle: title || "-",
        };

        setInfoData(newInfoData);
        if (callback) callback(newInfoData); // 데이터 준비 후 콜백 호출
      })
      .catch((error) => {
        console.error("Failed to fetch media info:", error);
        resetInfoData();
      });
  };

  const resetInfoData = () => {
    setInfoData({
      vidUrl: "-",
      author: "-",
      thumb: defaultImage,
      vidTitle: "-",
    });
  };

  return {
    infoData,
    setInfoData,
    setMusicInfo,
    defaultImage,
    resetInfoData,
  };
};

export default useMediaInfo;
