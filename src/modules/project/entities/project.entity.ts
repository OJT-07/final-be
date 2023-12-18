import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Unique,
} from "typeorm";

import { StatusProject } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";
import { HistoriesEntity } from "@app/modules/history/entities";
import { EmployeeEntity } from "@app/modules/employee/entities";

@Entity("projects")
@Unique(["name", "deletedAt"])
export class ProjectEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description: string;

  @Column({
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ type: "varchar", length: 500, array: true, default: [] })
  technical: string[];

  @Column({ type: "enum", enum: StatusProject, default: StatusProject.ACTIVE })
  status: StatusProject;

  @ManyToMany(() => EmployeeEntity, {
    cascade: true,
  })
  @JoinTable({
    name: "project_employee",
    joinColumn: {
      name: "projectId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "employeeId",
      referencedColumnName: "id",
    },
  })
  employees: EmployeeEntity[];

  @OneToMany(() => HistoriesEntity, (history) => history.project)
  histories: HistoriesEntity[];
}
