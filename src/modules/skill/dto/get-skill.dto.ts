import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "@app/common/dtos";

export class GetSkillsDto extends PageOptionsDto {
  @IsOptional()
  name?: string;
}
