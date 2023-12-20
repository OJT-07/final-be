import { StatusProject } from "@Constant/enums";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
export class UpdateProjectDto {
  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  start_date?: Date;

  @Expose()
  end_date?: Date;

  @Expose()
  technical?: string[];

  @Expose()
  position: string[];

  @Expose()
  employeeIds?: number[];

  @Expose()
  @IsOptional()
  @IsEnum(StatusProject)
  status?: StatusProject;
}
