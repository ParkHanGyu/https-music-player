export const getPlatformUrl = (url: string) => {
  if (url.includes("youtu")) {
    const youTubeIdMatch = url.match(
      /(?:youtu\.be\/|(?:v=|.*[?&]v=))([a-zA-Z0-9_-]{11})/
    );
    if (youTubeIdMatch) {
      return `https://youtu.be/${youTubeIdMatch[1]}`;
    }
  } else if (url.includes("soundcloud")) {
    return url;
  }
  return;
};
