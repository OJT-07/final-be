
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class UpdateEmployeeDto {
  @Expose()
  phone: string;

  @Expose()
  name: string;

  @Expose()
  date_of_birth: Date;

  @Expose()
  skills: [
    {
        name: string,
        exp: string
    }
  ];

  @Expose()
  role: string;

  @Expose()
  department: string;

  @Expose()
  manager: string;

  @Expose()
  position: string;
}
