export const getPlatformUrl = (url: string): string => {
  if (url.includes("youtu")) {
    let urlId;

    // "v="이 있으면
    if (url.includes("v=")) {
      urlId = url.match(/(?:\?v=)([a-zA-Z0-9_-]+)/);

      // "v="가 없고 "?si="가 있다면
    } else if (url.includes("?si=")) {
      urlId = url.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
      // "v=", "?si="가 없고 "?list="가 있다면
    } else if (url.includes("?list=")) {
      urlId = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    }
    return urlId ? `https://youtu.be/${urlId[1]}` : url;
  } else if (url.includes("soundcloud")) {
    return url;
  }
  // 필요한 경우 다른 플랫폼도 추가 가능
  return url;
};
