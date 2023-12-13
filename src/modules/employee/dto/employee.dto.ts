import { EmployeeEntity } from "../entities";

export class EmployeeDto {
  name: string;
  phone: string;
  date_of_birth: Date;
  skills: [
    {
        name: string,
        exp: string
    }
  ];
  isManager: boolean;
  image: string;

  }

