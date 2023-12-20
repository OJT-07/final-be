import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository, SelectQueryBuilder } from "typeorm";
import { EmployeeProjectDto } from "./dto/employee_project.dto";
import { GetEmployeeProjectsDto } from "./dto/get-employee_project.dto";
import { HistoriesEntity } from "./entities";

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(HistoriesEntity)
    private readonly historiesRepository: Repository<HistoriesEntity>
  ) {}

  async getEmployeeProjects(
    params: GetEmployeeProjectsDto
  ): Promise<ResponsePaginate<EmployeeProjectDto>> {
    const queryBuilder: SelectQueryBuilder<HistoriesEntity> =
      this.historiesRepository
        .createQueryBuilder("histories")
        .leftJoinAndSelect("histories.project", "project")
        .leftJoinAndSelect("histories.employee", "employee");

    const [result, total] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, "Success");
  }

  async getEmployeeProject(
    id: number
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    const employeeProject = await this.historiesRepository.findOne({
      where: {
        id,
      },
      relations: ["employee", "project"],
    });
    if (!employeeProject)
      throw new BadRequestException("Employee Project does not exist");

    const employeeProjectDto = plainToClass(
      EmployeeProjectDto,
      employeeProject
    );

    return new ResponseItem(employeeProjectDto, "Success");
  }
}
