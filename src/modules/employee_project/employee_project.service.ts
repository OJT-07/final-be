import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { EmployeeProjectEntity } from "./entities";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateEmployeeProjectDto } from "./dto/create-employee_project.dto";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { EmployeeProjectDto } from "./dto/employee_project.dto";
import { plainToClass } from "class-transformer";
import { GetEmployeeProjectsDto } from "./dto/get-employee_project.dto";

@Injectable()
export class EmployeeProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EmployeeProjectEntity)
    private readonly employeeProjectRepository: Repository<EmployeeProjectEntity>
  ) { }

  async create(params: CreateEmployeeProjectDto): Promise<ResponseItem<EmployeeProjectDto>> {
    const employeeExisted = await this.employeeProjectRepository.findOneBy({
      employeeId: params.employeeId,
    });
    if (employeeExisted) throw new BadRequestException("Employee name already exists");

    const projectExisted = await this.employeeProjectRepository.findOneBy({
      projectId: params.projectId,
    });
    if (projectExisted)
      throw new BadRequestException("Project number already exists");

    const employeeProject = await this.employeeProjectRepository.save(params)

    return new ResponseItem(plainToClass(EmployeeProjectDto, employeeProject), "Create new data successfully");
  }

  async getEmployeeProjects(params: GetEmployeeProjectsDto): Promise<ResponsePaginate<EmployeeProjectDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeProjectEntity> = this.employeeProjectRepository.createQueryBuilder("employeeProjects");
    queryBuilder
      // .orderBy(`employeeProjects.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    // if (params.search) {
    //   queryBuilder.andWhere("LOWER(employeeProjects.name) LIKE LOWER(:name)", {
    //     name: `%${params.search}%`,
    //   });
    // }

    const [result, total] = await queryBuilder.getManyAndCount();

    const employeeProjectsDto = result.map((employeeProject) => plainToClass(EmployeeProjectDto, employeeProject));

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeeProjectsDto, pageMetaDto, "Success");
  }
}