import { Column, Entity, ManyToOne, Unique } from "typeorm";

import { StatusEnum } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";
import { UserEntity } from "@app/modules/user/entities";

@Entity("projects")
@Unique(["name", "deletedAt"])
export class ProjectEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", length: 500 })
  description: string;

  @Column({ type: "varchar", length: 500 })
  start_date: string;

  @Column({ type: "varchar", length: 500 })
  end_date: string;

  @Column({ type: "varchar", length: 500 })
  technical: string;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
