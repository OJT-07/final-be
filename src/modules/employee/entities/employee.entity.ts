import { Column, Entity, OneToMany, OneToOne, Unique } from "typeorm";

import { StatusEnum } from "@Constant/enums";
import { AbstractEntity } from "@Entity/abstract.entity";
import { PositionEntity } from "@app/modules/position/entities";
import { SkillEntity } from "@app/modules/skill/entities";

@Entity("users")
@Unique(["phone", "deletedAt"])
@Unique(["username", "deletedAt"])
export class EmployeeEntity extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "varchar" })
  date_of_birth: string;

  @Column({ type: "varchar" })
  avatar: string;

  @OneToMany(() => SkillEntity, (skill) => skill.employee)
  skills: SkillEntity[];

  @OneToOne(() => PositionEntity, (position) => position.employee)
  position: PositionEntity;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
