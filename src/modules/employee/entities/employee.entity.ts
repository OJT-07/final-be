import { Column, Entity, OneToMany, OneToOne, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";

@Entity("employees")
@Unique(["phone", "deletedAt"])
@Unique(["name", "deletedAt"])
export class EmployeeEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  role: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "varchar" })
  date_of_birth: string;

  @Column({ type: "varchar" })
  avatar: string;

  @Column({ type: "jsonb", nullable: true })
  skills: [{ name: string; exp: number }];

  @Column({ type: "varchar" })
  position: string;

  @Column({ type: "varchar" })
  department: string;

  @Column({ type: "varchar" })
  manager: string;
}
