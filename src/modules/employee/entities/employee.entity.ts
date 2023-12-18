import { Column, Entity, Generated, OneToMany, Unique } from "typeorm";

import { AbstractEntity } from "@Entity/abstract.entity";
import { HistoriesEntity } from "@app/modules/history/entities";

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

  @OneToMany(() => HistoriesEntity, (history) => history.employee)
  histories: HistoriesEntity[];
}
