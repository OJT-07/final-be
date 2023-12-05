import { AbstractEntity } from "@Entity/abstract.entity";
import { EmployeeEntity } from "@app/modules/employee/entities";
import { Column, Entity, OneToOne, Unique } from "typeorm";

@Entity("positions")
@Unique(["name", "deletedAt"])
export class PositionEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  description: string;

  @OneToOne(() => EmployeeEntity, (employee) => employee.position)
  employee: EmployeeEntity;
}
