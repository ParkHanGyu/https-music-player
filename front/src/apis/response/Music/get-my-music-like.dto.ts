import LikeRankMusic from "../../../types/interface/like-rank-music.interface";
import ResponseDto from "../response.dto";

export default interface myMusicLikeResponseDto extends ResponseDto {
  musicList: LikeRankMusic[];
}
