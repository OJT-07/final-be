import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";
import { ProjectEntity } from "@app/modules/project/entities";

@Entity("employees")
@Unique(["phone", "deletedAt"])
@Unique(["name", "deletedAt"])
export class EmployeeEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ type: "jsonb" })
  skills: [{ name: string; exp: string }];

  @Column({ default: false })
  isManager: boolean;

  @Column({ type: "jsonb", nullable: true })
  manager: [{ name: string; id: number }];

  @Column({ nullable: true })
  image: string;

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
