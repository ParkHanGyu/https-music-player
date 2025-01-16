import ResponseDto from "../response.dto";

export default interface SignInResponseDto extends ResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationTime: number;
  refreshTokenExpirationTime: number;
}
