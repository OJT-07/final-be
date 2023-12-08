import { StatusProject } from "@Constant/enums";

export class ProjectDto {
  name?: string;

  description?: string;

  start_date?: Date;

  end_date?: Date;

  technical?: string[];

  status?: StatusProject;
}
