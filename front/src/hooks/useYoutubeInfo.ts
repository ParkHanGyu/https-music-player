import { useState } from "react";
import { YoutubeInfo } from "../types/interface/youtube.interface";

const noEmbed = "https://noembed.com/embed?url=";
const urlForm = "https://www.youtube.com/watch?v=";

// 커스텀 훅: useYoutubeInfo
const useYoutubeInfo = (defaultImage: string) => {
  const [youtube, setYoutube] = useState<YoutubeInfo>({
    vidUrl: "-",
    author: "-",
    thumb: defaultImage,
    vidTitle: "-",
  });

  const getInfo = (id: string) => {
    const fullUrl = `${noEmbed}${urlForm}${id}`;
    fetch(fullUrl)
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
        console.log(data);
      });
  };

  const setInfo = (data: any) => {
    const { url, author_name, thumbnail_url, title } = data;
    setYoutube({
      vidUrl: url || null,
      author: author_name || null,
      thumb: thumbnail_url || null,
      vidTitle: title || null,
    });
  };

  // youtube 상태, reset 함수, getInfo 함수 반환
  return { youtube, setYoutube, getInfo, defaultImage };
};

export default useYoutubeInfo;
