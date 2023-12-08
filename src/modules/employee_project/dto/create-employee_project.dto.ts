import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateEmployeeProjectDto {
  join_date: string;

  end_date: string;

  position: string;

  @Expose()
  @IsNotEmpty()
  projectId: number;

  @Expose()
  @IsNotEmpty()
  employeeId: number;
}
