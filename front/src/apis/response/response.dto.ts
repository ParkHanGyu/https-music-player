import { ResponseCode } from "../../types/enum/index";

export default interface ResponseDto {
  code: ResponseCode;
  message: string;
}
