import { YoutubeInfo } from "../../../types/interface/youtube.interface";
import ResponseDto from "../response.dto";

export default interface AddMusicResponseDto extends ResponseDto {
  userName: string;
  youtube: YoutubeInfo;
  infoDuration: number;
  playlistId: bigint;
}