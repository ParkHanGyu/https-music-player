import Music from "../../../types/interface/music.interface";
import ResponseDto from "../response.dto";

export default interface GetMusicResponseDto extends ResponseDto {
  musicList: Music[];
}
