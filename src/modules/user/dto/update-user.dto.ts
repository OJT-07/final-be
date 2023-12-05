import { StatusEnum } from "@Constant/enums";
import { ProjectEntity } from "@app/modules/project/entities";
import { Expose } from "class-transformer";

export class UpdateUserDto {
  @Expose()
  phone: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  projects?: ProjectEntity[];
}
