import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "@app/common/dtos";
import { StatusProject } from "@Constant/enums";

export class GetProjectsDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(StatusProject)
  status;

  @IsOptional()
  name?: string;

  @IsOptional()
  technical: string[];
}
