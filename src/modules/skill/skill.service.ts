import { BadRequestException, Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SkillEntity } from "./entities";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { SkillDto } from "./dto/skill.dto";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { plainToClass } from "class-transformer";
import { GetSkillsDto } from "./dto/get-skill.dto";

@Injectable()
export class SkillService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>
  ) {}
  
  async create(params: CreateSkillDto): Promise<ResponseItem<SkillDto>> {
    const skill = await this.skillRepository.save(params)

    return new ResponseItem(plainToClass(SkillDto, skill), "Create new data successfully");
  }

  async deleteSkill(id: number): Promise<ResponseItem<null>> {
    const skill = await this.skillRepository.findOneBy({ id, deletedAt: null });
    if (!skill) throw new BadRequestException("Skill does not exist");

    await this.skillRepository.softDelete(id);

    return new ResponseItem(null, "Delete skill successfully");
  }

  async getSkills(params: GetSkillsDto): Promise<ResponsePaginate<SkillDto>> {
    const queryBuilder: SelectQueryBuilder<SkillEntity> = this.skillRepository.createQueryBuilder("skills");
    queryBuilder
      .orderBy(`skills.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      queryBuilder.andWhere("LOWER(skills.name) LIKE LOWER(:name)", {
        name: `%${params.search}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const skillsDto = result.map((skill) => plainToClass(SkillDto, skill));

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(skillsDto, pageMetaDto, "Success");
  }

  async getSkill(id: number): Promise<ResponseItem<SkillDto>> {
    const skill = await this.skillRepository.findOne({
      where: {
        id,
      },
    });
    if (!skill) throw new BadRequestException("Employee does not exist");

    const skillDto = plainToClass(SkillDto, skill);

    return new ResponseItem(skillDto, "Success");
  }
}
