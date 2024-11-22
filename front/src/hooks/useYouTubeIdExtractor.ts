import { useCallback } from "react";

const useYouTubeIdExtractor = () => {
  const extractYouTubeId = useCallback((url: string) => {
    let urlMatch;

    // www이 포함되어 있을때
    if (url.includes("www.")) {
      urlMatch = url.match(/(?<=\?v=)[\w-]{11}/); // v= 다음의 값을 찾기
    }
    // www이 없고 ?si=를 포함할 경우
    else if (url.includes("?si=")) {
      urlMatch = url.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
    }
    // https://youtu.be/로 시작할 때
    else {
      urlMatch = url.match(/(?<=https:\/\/youtu.be\/)[a-zA-Z0-9_-]+/);
    }

    return urlMatch ? urlMatch[0] : null;
  }, []);

  return { extractYouTubeId };
};

export default useYouTubeIdExtractor;
