import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateEmployeeProjectDto {
  
  @Expose()
  join_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  position: string;

  @Expose()
  projectId: number;

  @Expose()
  employeeId: number;
}
