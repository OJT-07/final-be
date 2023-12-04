import { Controller, Get, Query } from '@nestjs/common';

import { ResponsePaginate } from '@app/common/dtos';
import { GetRolesDto } from './dto/get-roles.dto';
import { RoleDto } from './dto/role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getRoles(@Query() getRolesDto: GetRolesDto): Promise<ResponsePaginate<RoleDto>> {
    return await this.rolesService.getRoles(getRolesDto);
  }
}
