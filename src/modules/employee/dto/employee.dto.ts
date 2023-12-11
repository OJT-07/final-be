export class EmployeeDto {
  name: string;
  role: string;
  phone: string;
  date_of_birth: Date;
  skills: [
    {
        name: string,
        exp: string
    }
  ];
  position: string;
  department: string;
  manager: string;
}
