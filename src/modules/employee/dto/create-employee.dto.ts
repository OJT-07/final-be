import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CreateEmployeeDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  date_of_birth: Date;

  @Expose()
  @IsNotEmpty()
  skills: Array<{ name: string; exp:string }>;

  @Expose()
  @IsNotEmpty()
  manager: Array<{ name: string; id:number }>;

  @Expose()
  @IsNotEmpty()
  isManager: boolean;

  @Expose()
  image: string;
}
