import { StatusProject } from "@Constant/enums";
import { Expose } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
export class CreateProjectDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsNotEmpty()
  start_date: string;

  @Expose()
  @IsNotEmpty()
  end_date: string;

  @Expose()
  @IsArray()
  @IsNotEmpty({ each: true })
  technical: string[];

  @Expose()
  @IsOptional()
  @IsEnum(StatusProject)
  status?: StatusProject;
}
