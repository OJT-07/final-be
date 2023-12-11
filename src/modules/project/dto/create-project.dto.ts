import { StatusProject } from "@Constant/enums";
import { Expose } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
export class CreateProjectDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  description: string;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  @IsArray()
  @IsNotEmpty({ each: true })
  technical: string[];

  @Expose()
  @IsOptional()
  @IsEnum(StatusProject)
  status?: StatusProject;
}
