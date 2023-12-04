import { StatusEnum } from '@Constant/enums';
import { RoleEntity } from '@app/modules/role/entities';

export class UserDto {
  username: string;

  phone: string;

  password: string;

  status?: StatusEnum;

  rfToken: string;

  role: RoleEntity;
}
