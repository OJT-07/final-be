import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class UpdateSkillDto {
  @Expose()
  description: string;

  @Expose()
  @IsNotEmpty()
  name: string;

}
