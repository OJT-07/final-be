import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, Unique } from "typeorm";

import { StatusEnum } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";
import { ProjectEntity } from "@app/modules/project/entities";

@Entity("users")
@Unique(["phone", "deletedAt"])
@Unique(["name", "deletedAt"])
export class UserEntity extends AbstractEntity {
  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone: string;

  @Column({ type: "varchar" })
  @Exclude()
  password: string;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
