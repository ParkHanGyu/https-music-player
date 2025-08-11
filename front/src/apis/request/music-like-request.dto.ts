import { MusicInfoData } from "../../types/interface/music-info-data.interface";

export default interface musicLikeRequestDto {
  // musicId: bigint;
  // playBarUrl: string;
  musicInfoData: MusicInfoData;
  infoDuration: number;
}
