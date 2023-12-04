import { Expose } from 'class-transformer';

import { StatusEnum } from '@Constant/enums';

export class RoleDto {
  @Expose()
  name: string;

  status: StatusEnum;

  @Expose()
  description: string;

  @Expose()
  isEditable: boolean;
}
