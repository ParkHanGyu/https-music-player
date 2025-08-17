import MyLikeMusic from "../../../types/interface/my-like-music.interface";
import ResponseDto from "../response.dto";

export default interface myMusicLikeResponseDto extends ResponseDto {
  musicList: MyLikeMusic[];
}
