import LikeRankMusic from "../../../types/interface/like-rank-music.interface";
import ResponseDto from "../response.dto";

export default interface musicLikeRankResponseDto extends ResponseDto {
  musicList: LikeRankMusic[];
}
