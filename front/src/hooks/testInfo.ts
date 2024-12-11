import { useState } from "react";
import { YoutubeInfo } from "../types/interface/youtube.interface";

const noEmbed = "https://noembed.com/embed?url=";

// 커스텀 훅: useMediaInfo (YouTube, SoundCloud 모두 지원)
const useMediaInfo = (defaultImage: string) => {
  const [infoData, setInfoData] = useState<YoutubeInfo>({
    vidUrl: "-",
    author: "-",
    thumb: defaultImage,
    vidTitle: "-",
  });

  const setMusicInfo = (url: string) => {
    const fullUrl = `${noEmbed}${url}`;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        const { url, author_name, thumbnail_url, title } = data;
        let processedTitle = title || "-";
        if (
          url.includes("soundcloud") &&
          title &&
          author_name &&
          title.includes(" by ") &&
          title.includes(author_name)
        ) {
          console.log("사클일때 info 폼 바뀜 ", processedTitle);
          // "by" 기준으로 분리하여 첫 번째 부분만 사용
          processedTitle = title.split(" by ")[0].trim();
        }

        setInfoData({
          vidUrl: url || "-",
          author: author_name || "-",
          thumb: thumbnail_url || defaultImage,
          vidTitle: processedTitle || "-",
        });
      })
      .catch((error) => {
        console.error("Failed to fetch media info:", error);
        resetInfoData(); // 오류 발생 시 기본값으로 초기화
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
