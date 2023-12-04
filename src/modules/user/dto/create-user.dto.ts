import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { RoleEntity } from '@app/modules/role/entities';

export class CreateUserDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  rfToken?: string;

  @Expose()
  @IsNotEmpty()
  role?: RoleEntity;
}
