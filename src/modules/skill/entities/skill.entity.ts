import { Column, Entity, ManyToOne, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";
import { EmployeeEntity } from "@app/modules/employee/entities";

@Entity("skills")
@Unique(["name", "deletedAt"])
export class SkillEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  description: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.skills)
  employee: EmployeeEntity;
}
