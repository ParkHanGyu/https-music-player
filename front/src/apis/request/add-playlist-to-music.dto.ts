import { YoutubeInfo } from "../../types/interface/youtube.interface";

export default interface AddPlayListToMusicRequestDto {
  userName: string;
  youtube: YoutubeInfo;
  infoDuration: number;
  playlistId: bigint;
}
