import NoembedMusicInfoData from "./music-info-data.interface";

export default interface Music {
  musicId: bigint;
  basicInfo: NoembedMusicInfoData;
  duration: number;
  createdAt: string;
  like: boolean;
}
