import { useState } from "react";
import NoembedMusicInfoData from "../types/interface/music-info-data.interface";

const noEmbed = "https://noembed.com/embed?url=";
// 커스텀 훅: useMediaInfo (YouTube, SoundCloud 모두 지원)
const useMediaInfo = (defaultImage: string) => {
  const [infoData, setInfoData] = useState<NoembedMusicInfoData>({
    url: "-",
    author: "-",
    imageUrl: defaultImage,
    title: "-",
  });

  const setMusicInfo = (
    url: string,
    callback?: (data: NoembedMusicInfoData) => void
  ) => {
    const fullUrl = `${noEmbed}${url}`;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("noembed data 값 : ", JSON.stringify(data, null, 2));
        const { url, author_name, thumbnail_url, title, error } = data;

        if (error) {
          console.log("noembed error");
          return;
        }

        let processedTitle = title || "-";
        if (
          url.includes("soundcloud") &&
          title &&
          author_name &&
          title.includes(" by ") &&
          title.includes(author_name)
        ) {
          processedTitle = title.split(" by ")[0].trim();
        }

        const newInfoData = {
          url: url || "-",
          author: author_name || "-",
          imageUrl: thumbnail_url || defaultImage,
          title: processedTitle || "-",
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
      url: "-",
      author: "-",
      imageUrl: defaultImage,
      title: "-",
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
