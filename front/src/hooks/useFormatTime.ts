import { useCallback } from "react";

const useFormatTime = () => {
  const pad = (number: number) => {
    return ("0" + number).slice(-2);
  };

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return null;

    const date = new Date(time * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    return hh ? `${hh}:${pad(mm)}:${ss}` : `${mm}:${ss}`;
  }, []);

  return formatTime;
};

export default useFormatTime;
