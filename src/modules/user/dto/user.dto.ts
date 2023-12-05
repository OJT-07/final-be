import { StatusEnum } from "@Constant/enums";
import { ProjectEntity } from "@app/modules/project/entities";

export class UserDto {
  username: string;

  phone: string;

  password: string;

  status?: StatusEnum;

  projects?: ProjectEntity[];
}
