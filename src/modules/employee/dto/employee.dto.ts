import { SkillDto } from "@app/modules/skill/dto/skill.dto";
import { SkillEntity } from "@app/modules/skill/entities";

export class EmployeeDto {
  name: string;
  role: string;
  phone: string;
  date_of_birth: string;
  avatar: string;
  skills: [
    {
        name: string,
        exp: number
    }
  ];
  position: string;
  department: string;
  manager: string;
}
