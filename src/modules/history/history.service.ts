import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { IsNull, Repository, SelectQueryBuilder } from "typeorm";
import { EmployeeEntity } from "../employee/entities";
import { ProjectEntity } from "../project/entities";
import { CreateEmployeeProjectDto } from "./dto/create-employee_project.dto";
import { EmployeeProjectDto } from "./dto/employee_project.dto";
import { GetEmployeeProjectsDto } from "./dto/get-employee_project.dto";
import { UpdateEmployeeProjectDto } from "./dto/update-employee_project.dto";
import { HistoriesEntity } from "./entities";

@Injectable()
export class HistoriesService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(HistoriesEntity)
    private readonly historiesRepository: Repository<HistoriesEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) {}

  async create(
    params: CreateEmployeeProjectDto
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    const historyExisted = await this.historiesRepository.findOne({
      where: {
        deletedAt: null,
      },
    });

    if (historyExisted)
      throw new BadRequestException("The history is on a project");

    const employeeExisted = await this.employeeRepository.findOne({
      where: {
        id: params.employee,
      },
    });
    if (!employeeExisted)
      throw new BadRequestException("Employee does not exists");

    const projectExisted = await this.projectRepository.findOne({
      where: {
        id: params.project,
      },
    });

    if (!projectExisted)
      throw new BadRequestException("Project does not exists");

    const employeeProject = await this.historiesRepository.save({
      ...params,
      employee: employeeExisted,
      project: projectExisted,
    });

    return new ResponseItem(
      plainToClass(EmployeeProjectDto, employeeProject),
      "Create new data successfully"
    );
  }

  async getEmployeeProjects(
    params: GetEmployeeProjectsDto
  ): Promise<ResponsePaginate<EmployeeProjectDto>> {
    const queryBuilder: SelectQueryBuilder<HistoriesEntity> =
      this.historiesRepository
        .createQueryBuilder("employeeProjects")
        .leftJoinAndSelect("employeeProjects.project", "project")
        .leftJoinAndSelect("employeeProjects.employee", "employee");

    const [result, total] = await queryBuilder.getManyAndCount();

    const employeeProjectsDto = result.map((employeeProject) =>
      plainToClass(EmployeeProjectDto, {
        id: employeeProject.id.toString(),
        join_date: employeeProject.join_date,
        end_date: employeeProject.end_date,
        project: employeeProject.project,
        employee: employeeProject.employee,
      })
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeeProjectsDto, pageMetaDto, "Success");
  }

  async getEmployeeProject(
    id: number
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    const employeeProject = await this.historiesRepository.findOne({
      where: {
        id,
      },
    });
    if (!employeeProject)
      throw new BadRequestException("Employee Project does not exist");

    const employeeProjectDto = plainToClass(
      EmployeeProjectDto,
      employeeProject
    );

    return new ResponseItem(employeeProjectDto, "Success");
  }

  async deleteEmployeeProject(id: number): Promise<ResponseItem<null>> {
    const employee_project = await this.historiesRepository.findOneBy({
      id,
    });

    if (!employee_project)
      throw new BadRequestException("Employee_project does not exist");

    const idDelete = {
      id: employee_project.id,
      // projectId: employee_project.projectId,
      // employeeId: employee_project.employeeId,
    };
    await this.historiesRepository.delete(idDelete);

    return new ResponseItem(null, "Delete Employee_Project successfully");
  }

  async update(
    id: number,
    params: UpdateEmployeeProjectDto
  ): Promise<ResponseItem<HistoriesEntity>> {
    const project = await this.historiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException(`EMployee_Project not found`);
    }

    // Perform the update
    await this.historiesRepository.update(
      {
        id: project.id,
      },
      {
        ...params,
        // Use plainToClass with ProjectDto instead of CreateProjectDto
        ...plainToClass(ProjectEntity, params, {
          excludeExtraneousValues: true,
        }),
      }
    );

    // Retrieve the updated project
    const updatedEmployeeProject = await this.historiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!updatedEmployeeProject) {
      throw new NotFoundException(`Error retrieving updated employee_project`);
    }

    return new ResponseItem(updatedEmployeeProject, "Update data successfully");
  }
}
