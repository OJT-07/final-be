import { Expose, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CreateEmployeeDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  @IsNotEmpty()
  date_of_birth: string;

  @Expose()
  @IsNotEmpty()
  skills: Array<{ name: string; exp:number }>;

  @Expose()
  @IsNotEmpty()
  role: string;

  @Expose()
  position: string;

  @Expose()
  @IsNotEmpty()
  department: string;

  @Expose()
  @IsNotEmpty()
  manager: string;
}