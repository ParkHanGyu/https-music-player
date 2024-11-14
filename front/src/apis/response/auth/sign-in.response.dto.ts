import ResponseDto from "../response.dto";

export default interface SignInResponseDto extends ResponseDto {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
}
