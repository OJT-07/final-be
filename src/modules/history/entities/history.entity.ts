import { AbstractEntity } from "@Entity/abstract.entity";
import { EmployeeEntity } from "@app/modules/employee/entities";
import { ProjectEntity } from "@app/modules/project/entities";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity("histories")
export class HistoriesEntity extends AbstractEntity {
  @Column({ default: () => "CURRENT_TIMESTAMP(6)" })
  join_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ type: "varchar" })
  position: string;

  @ManyToOne(() => ProjectEntity, (project) => project.histories)
  project: ProjectEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.histories)
  employee: EmployeeEntity;
}
