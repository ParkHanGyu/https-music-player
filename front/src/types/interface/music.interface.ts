import NoembedMusicInfoData from "./music-info-data.interface";

export default interface Music {
  musicId: bigint;
  duration: number;
  createdAt: string;
  like: boolean;
  basicInfo: NoembedMusicInfoData;
}
