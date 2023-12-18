import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @Expose()
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsNotEmpty()
  password: string;
}
