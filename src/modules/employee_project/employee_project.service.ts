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
import { EmployeeEntity } from "../employee/entities";
import { ProjectEntity } from "../project/entities";

@Injectable()
export class EmployeeProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EmployeeProjectEntity)
    private readonly employeeProjectRepository: Repository<EmployeeProjectEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) { }

  async create(params: CreateEmployeeProjectDto): Promise<ResponseItem<EmployeeProjectDto>> {

    const EmployeeProjectExisted = await this.employeeProjectRepository
    .findOne({
      where: {
        projectId: params.projectId,
        employeeId: params.employeeId,
      },
    });
    
    if (EmployeeProjectExisted) throw new BadRequestException("Employee Project not exists");

    const employeeExisted = await this.employeeRepository
    .findOne({
      where: {
        id: params.employeeId,
      },
    });
    if (!employeeExisted) throw new BadRequestException("Employee name not exists");

    const projectExisted = await this.projectRepository
    .findOne({
      where: {
        id: params.projectId,
      },
    });
    if (!projectExisted) throw new BadRequestException("Project name already exists");

    const employeeProject = await this.employeeProjectRepository.save(params)

    return new ResponseItem(plainToClass(EmployeeProjectDto, employeeProject), "Create new data successfully");
  }

  async getEmployeeProjects(params: GetEmployeeProjectsDto): Promise<ResponsePaginate<EmployeeProjectDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeProjectEntity> = this.employeeProjectRepository.createQueryBuilder("employeeProjects")
    .leftJoinAndSelect('employeeProjects.project', 'project')
    .leftJoinAndSelect('employeeProjects.employee', 'employee');
   
    const [result, total] = await queryBuilder.getManyAndCount();

    const employeeProjectsDto  = result.map((employeeProject) => plainToClass(EmployeeProjectDto,  {
      id: employeeProject.id.toString(),
      join_date: employeeProject.join_date,
      end_date: employeeProject.end_date,
      position: employeeProject.position,
      project: employeeProject.project,
      employee: employeeProject.employee,
    }));



    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeeProjectsDto, pageMetaDto, "Success");
  }

  async getEmployeeProject(id: number): Promise<ResponseItem<EmployeeProjectDto>> {
    const employeeProject = await this.employeeProjectRepository.findOne({
      where: {
        id,
      },
    });
    if (!employeeProject) throw new BadRequestException("Employee does not exist");

    const employeeProjectDto = plainToClass(EmployeeProjectDto, employeeProject);

    return new ResponseItem(employeeProjectDto, "Success");
  }

}