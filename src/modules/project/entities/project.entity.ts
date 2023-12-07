import { Column, Entity, Unique } from "typeorm";

import { StatusProject } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";

@Entity("projects")
@Unique(["name", "deletedAt"])
export class ProjectEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", length: 500 })
  description: string;

  @Column({ type: "varchar", length: 500 })
  start_date: string;

  @Column({ type: "varchar", length: 500 })
  end_date: string;

  @Column({ type: "varchar", length: 500, array: true, default: [] })
  technical: string[];

  @Column({ type: "enum", enum: StatusProject, default: StatusProject.ACTIVE })
  status: StatusProject;
}
