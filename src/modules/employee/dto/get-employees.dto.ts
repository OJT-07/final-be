import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "@app/common/dtos";

export class GetEmployeesDto extends PageOptionsDto {
  @IsOptional()
  name?: string;
}