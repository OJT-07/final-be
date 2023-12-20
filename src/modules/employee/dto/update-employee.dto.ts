import { Expose } from "class-transformer";

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
      name: string;
      exp: string;
    }
  ];

  @Expose()
  isManager: boolean;

  @Expose()
  image: string;

  @Expose()
  join_date: Date;

  @Expose()
  address: string;

  @Expose()
  email: string;

  @Expose()
  description: string;
}
