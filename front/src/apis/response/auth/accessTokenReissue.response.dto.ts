import ResponseDto from "../response.dto";

export default interface accessTokenReissueResponseDto extends ResponseDto {
  accessToken: string;
  accessTokenExpirationTime: number;
}
