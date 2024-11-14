import User from "../../../types/interface/user.interface";
import ResponseDto from "../response.dto";

export default interface GetUserResponseDto extends ResponseDto {
  userDto: User;
}
