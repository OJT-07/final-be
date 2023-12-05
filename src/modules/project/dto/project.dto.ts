import { StatusEnum } from "@Constant/enums";

export class ProjectDto {
  username: string;

  phone: string;

  password: string;

  status?: StatusEnum;
}
