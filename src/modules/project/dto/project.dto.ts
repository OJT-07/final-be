import { StatusProject } from "@Constant/enums";

export class ProjectDto {
  name?: string;

  description?: string;

  start_date?: string;

  end_date?: string;

  technical?: string[];

  status?: StatusProject;
}
