import ResponseDto from "../response.dto";

export default interface authNumberCheckResponseDto extends ResponseDto {
  expireTime: number;
}
