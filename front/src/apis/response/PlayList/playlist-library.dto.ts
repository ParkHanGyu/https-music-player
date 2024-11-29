import Playlist from "../../../types/interface/playList.interface";
import ResponseDto from "../response.dto";

export default interface GetPlaylistResponseDto extends ResponseDto {
  playListLibrary: Playlist[];
}
