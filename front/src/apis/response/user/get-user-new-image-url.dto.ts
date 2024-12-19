import ResponseDto from "../response.dto";

export default interface GetUserImageResponseDto extends ResponseDto {
  profileImage: string;
}
