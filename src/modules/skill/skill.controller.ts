import { Controller } from "@nestjs/common";
import { SkillService } from "./skill.service";

@Controller("skills")
export class SkillController {
  constructor(private readonly employeeService: SkillService) {}
}
