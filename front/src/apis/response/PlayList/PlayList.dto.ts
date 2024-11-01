import Playlist from "../../../types/interface/playList.interface";
import ResponseDto from "../response.dto";

export default interface GetPlayListResponseDto extends ResponseDto {
  playlists: Playlist[];
}
