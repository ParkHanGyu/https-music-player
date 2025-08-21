import NoembedMusicInfoData from "../../types/interface/music-info-data.interface";

export default interface AddPlayListToMusicRequestDto {
  musicInfoData: NoembedMusicInfoData;
  infoDuration: number;
  playlistId: bigint;
}
