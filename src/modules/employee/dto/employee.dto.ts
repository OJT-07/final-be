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
  manager: [
    { name: string,
      id:number 
    }
  ];
  isManager: boolean;
  image: string;
}
