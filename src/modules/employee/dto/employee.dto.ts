import { StatusEnum } from "@Constant/enums";

export class EmployeeDto {
  name: string;
  code: string;
  phone: string;
  date_of_birth: string;
  avatar: string;
  skills: string;
  position: string;
  status?: StatusEnum;
}
