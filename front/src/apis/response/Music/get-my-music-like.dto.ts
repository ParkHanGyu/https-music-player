import Music from "../../../types/interface/music.interface";
import ResponseDto from "../response.dto";

export default interface myMusicLikeResponseDto extends ResponseDto {
  musicList: Music[];
}
