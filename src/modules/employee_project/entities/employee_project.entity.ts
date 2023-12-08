import { EmployeeEntity } from "@app/modules/employee/entities";
import { ProjectEntity } from "@app/modules/project/entities";
import { Exclude } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("employee_project")
export class EmployeeProjectEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ default: () => "CURRENT_TIMESTAMP(6)" })
  join_date: Date;

  @Column({ nullable: true })
  end_date: Date;

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

  @ManyToOne(() => ProjectEntity, { eager: true })
  @JoinColumn({ name: "projectId", referencedColumnName: "id" })
  project: ProjectEntity; // This is the related ProjectEntity

  @ManyToOne(() => EmployeeEntity, { eager: true })
  @JoinColumn({ name: "employeeId", referencedColumnName: "id" })
  employee: EmployeeEntity; // This is the related ProjectEntity

  @CreateDateColumn({
    type: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  @Exclude()
  createdAt: Date;

  @Column({ type: "bigint", nullable: true })
  @Exclude()
  createdBy: number;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  @Exclude()
  updatedAt: Date;

  @Column({ type: "bigint", nullable: true })
  @Exclude()
  updatedBy: number;

  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
  })
  @Exclude()
  deletedAt: Date;

  @Column({ type: "bigint", nullable: true })
  @Exclude()
  deletedBy: number;
}
