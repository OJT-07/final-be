import { StatusEnum } from "@Constant/enums";

export class ProjectDto {
  name: string;

  phone: string;

  password: string;

  status?: StatusEnum;
}
