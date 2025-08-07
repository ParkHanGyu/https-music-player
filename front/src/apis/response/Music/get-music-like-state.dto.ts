import ResponseDto from "../response.dto";

export default interface musicLikeStateResponseDto extends ResponseDto {
  targetLikeState: boolean;
}
