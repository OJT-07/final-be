import { StatusEnum } from "@Constant/enums";

export class PositionDto {
  name: string;

  phone: string;

  password: string;

  status?: StatusEnum;
}
