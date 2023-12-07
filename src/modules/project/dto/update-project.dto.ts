import { StatusProject } from "@Constant/enums";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
export class UpdateProjectDto {
  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  start_date?: string;

  @Expose()
  end_date?: string;

  @Expose()
  technical?: string[];

  @Expose()
  @IsOptional()
  @IsEnum(StatusProject)
  status?: StatusProject;
}
