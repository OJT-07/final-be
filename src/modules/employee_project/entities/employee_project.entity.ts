import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('employee_project')
export class EmployeeProjectEntity {
  @Column()
  join_date: string;

  @Column()
  end_date: string;

  @Column()
  position: string;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  projectId: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  employeeId: number;
}