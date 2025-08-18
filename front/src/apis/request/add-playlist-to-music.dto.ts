import MusicInfoData from "../../types/interface/music-info-data.interface";

export default interface AddPlayListToMusicRequestDto {
  musicInfoData: MusicInfoData;
  infoDuration: number;
  playlistId: bigint;
}
