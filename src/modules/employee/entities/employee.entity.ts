import { Column, Entity, Generated, JoinTable, ManyToMany, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";
import { ProjectEntity } from "@app/modules/project/entities";
import { v4 as uuidv4 } from 'uuid';

@Entity("employees")
@Unique(["phone", "deletedAt"])
@Unique(["name", "deletedAt"])
export class EmployeeEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column()
  @Generated("uuid")
  code: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ type: "jsonb" })
  skills: [{ name: string; exp: string }];

  @Column({ default: false })
  isManager: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: false })
  join_date: Date;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @ManyToMany(() => ProjectEntity)
  @JoinTable({
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
