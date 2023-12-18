import { StatusEnum } from "@Constant/enums";

export class UserDto {
  name?: string;

  phone?: string;

  password?: string;

  status?: StatusEnum;

  token?: string;
}
