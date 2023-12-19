import { ProjectEntity } from "@app/modules/project/entities";

export class EmployeeProjectDto {
  join_date: Date;
  end_date: Date;
  position: string[];
  project: ProjectEntity;
}
