import { Column, Entity, ManyToOne, Unique } from "typeorm";

import { StatusEnum } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";
import { UserEntity } from "@app/modules/user/entities";

@Entity("users")
@Unique(["phone", "deletedAt"])
@Unique(["username", "deletedAt"])
export class ProjectEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.projects)
  manager: UserEntity;

  @Column({ type: "varchar", length: 50 })
  username: string;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
