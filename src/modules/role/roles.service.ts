import { StatusEnum } from '@Constant/enums';
import { PageMetaDto, ResponsePaginate } from '@app/common/dtos';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRolesDto } from './dto/get-roles.dto';
import { RoleEntity } from './entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>
  ) {}

  async getRoles(params: GetRolesDto): Promise<ResponsePaginate<RoleEntity>> {
    const roles = this.rolesRepository
      .createQueryBuilder('roles')
      .where('roles.status = ANY(:status)', {
        status: params.status ? [params.status] : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .orderBy(`roles.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      roles.andWhere('(LOWER(roles.name)) LIKE (LOWER(:name))', {
        name: `%${params.search}%`,
      });
    }

    const [result, total] = await roles.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }
}
