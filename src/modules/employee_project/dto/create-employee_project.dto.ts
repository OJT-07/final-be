import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateEmployeeProjectDto {
  @Expose()
  join_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  @IsNotEmpty()
  position: string;

  @Expose()
  @IsNotEmpty()
  projectId: number;

  @Expose()
  @IsNotEmpty()
  employeeId: number;
}
