import { Expose } from "class-transformer";

export class CreateEmployeeProjectDto {
  @Expose()
  join_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  position: string[];

  @Expose()
  project: number;

  @Expose()
  employee: number;
}
