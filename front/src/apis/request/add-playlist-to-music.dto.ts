import { YoutubeInfo } from "../../types/interface/youtube.interface";

export default interface AddPlayListToMusicRequestDto {
  youtube: YoutubeInfo;
  infoDuration: number;
  playlistId: bigint;
}
