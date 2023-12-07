import { EmployeeEntity } from "@app/modules/employee/entities";
import { ManyToOne } from "typeorm";

export class SkillDto {
  name: string;
  exp: number;
  description: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.skills)
  employee: EmployeeEntity;
}
