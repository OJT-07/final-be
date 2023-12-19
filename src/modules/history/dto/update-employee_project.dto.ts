import { Expose } from "class-transformer";

export class UpdateEmployeeProjectDto {
  @Expose()
  join_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  position: string[];

  @Expose()
  projectId: number;

  @Expose()
  employeeId: number;
}
