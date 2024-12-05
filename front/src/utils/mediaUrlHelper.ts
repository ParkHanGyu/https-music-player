// utils/mediaUrlHelper.ts (유틸리티 파일)
export const getPlatformUrl = (url: string): string | null => {
  if (url.includes("youtu")) {
    let urlMatch;

    // "v="이 있으면
    if (url.includes("v=")) {
      urlMatch = url.match(/(?:\?v=)([a-zA-Z0-9_-]+)/);

      // "v="가 없고 "?si="가 있다면
    } else if (url.includes("?si=")) {
      urlMatch = url.match(/(?<=youtu.be\/)([a-zA-Z0-9_-]+)(?=\?)/);
    }
    return urlMatch ? `https://youtu.be/${urlMatch[1]}` : url;
  } else if (url.includes("soundcloud")) {
    alert("사클 url 들어옴");

    return url;
  }
  // 필요한 경우 다른 플랫폼도 추가 가능
  return url;
};
