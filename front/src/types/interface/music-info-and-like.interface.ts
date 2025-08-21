import NoembedMusicInfoData from "./music-info-data.interface";

export default interface MusicInfoAndLikeData {
  musicInfo: NoembedMusicInfoData;
  like: boolean | undefined;
}
