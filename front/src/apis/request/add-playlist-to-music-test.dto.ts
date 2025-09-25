import AddMusicInfoData from "../../types/interface/music-info-data-test.interface";
import TestInfoData from "../../types/interface/music-info-data-test.interface";
import NoembedMusicInfoData from "../../types/interface/music-info-data.interface";

export default interface AddPlayListToMusicTestRequestDto {
  addInfoDataDto: AddMusicInfoData[];
  playlistId: bigint;
}
