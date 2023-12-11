import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";
import { ProjectEntity } from "@app/modules/project/entities";

@Entity("employees")
@Unique(["phone", "deletedAt"])
@Unique(["name", "deletedAt"])
export class EmployeeEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  role: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ type: "jsonb" })
  skills: [{ name: string; exp: string }];

  @Column({ type: "varchar" })
  position: string;

  @Column({ type: "varchar" })
  department: string;

  @Column({ type: "varchar", nullable: true })
  manager: string;

  @ManyToMany(() => ProjectEntity)
  @JoinTable ({
    name: 'employee_project',
    joinColumn: {
      name: 'employeeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
  })
  projects: ProjectEntity[];
}
