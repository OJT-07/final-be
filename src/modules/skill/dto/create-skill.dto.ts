import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateSkillDto {
  @Expose()
  description: string;

  @Expose()
  @IsNotEmpty()
  name: string;
}
