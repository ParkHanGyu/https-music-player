import Music from "../../../types/interface/music.interface";
import ResponseDto from "../response.dto";

export default interface GetMusciResponseDto extends ResponseDto {
  musicList: Music[];
}
