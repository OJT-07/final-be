import { StatusEnum } from '@Constant/enums';
import { RoleEntity } from '@app/modules/role/entities';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @Expose()
  phone: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  role: RoleEntity;
}
