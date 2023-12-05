import { ProjectEntity } from "@app/modules/project/entities";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsNotEmpty()
  projects?: ProjectEntity[];
}
