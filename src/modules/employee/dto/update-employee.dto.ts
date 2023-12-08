
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class UpdateEmployeeDto {
  @Expose()
  phone: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  date_of_birth: string;

  @Expose()
  skills: [
    {
        name: string,
        exp: number
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
