import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "@app/common/dtos";

export class GetEmployeeProjectsDto extends PageOptionsDto {
  @IsOptional()
  projectId?: string;
}
