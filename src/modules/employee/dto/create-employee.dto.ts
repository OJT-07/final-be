import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CreateEmployeeDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  date_of_birth: Date;

  @Expose()
  @IsNotEmpty()
  skills: Array<{ name: string; exp:string }>;

  @Expose()
  @IsNotEmpty()
  role: string;

  @Expose()
  position: string;

  @Expose()
  @IsNotEmpty()
  manager: string;
}
