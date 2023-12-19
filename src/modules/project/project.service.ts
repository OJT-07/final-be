import { Order, StatusProject } from "@Constant/enums";
import { ResponseItem } from "@app/common/dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { EmployeeEntity } from "../employee/entities";
import { CreateProjectDto } from "./dto/create-project.dto";
import { GetProjectsDto } from "./dto/get-project.dto";
import { ProjectDto } from "./dto/project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectEntity } from "./entities";
import { HistoriesEntity } from "../history/entities";

@Injectable()
export class ProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(HistoriesEntity)
    private readonly historiesEntity: Repository<HistoriesEntity>
  ) {}

  async getProjects(): Promise<ResponseItem<ProjectDto>> {
    const queryBuilder: SelectQueryBuilder<ProjectEntity> =
      this.projectRepository.createQueryBuilder("projects");

    queryBuilder
      .leftJoinAndSelect("projects.histories", "histories")
      .leftJoinAndSelect("histories.employee", "employee")
      .orderBy(`projects.id`, Order.DESC);

    const [result, _] = await queryBuilder.getManyAndCount();

    return new ResponseItem(result, "Get data successfully");
  }

  async create(params: CreateProjectDto): Promise<ResponseItem<ProjectDto>> {
    const projectExist = await this.projectRepository.findOne({
      where: {
        name: params.name,
      },
    });

    if (projectExist) {
      throw new NotFoundException(`Project name already exist`);
    }

    let arrayTechnical = [];
    for (let i = 0; i < params.technical.length; i++) {
      arrayTechnical.push(params.technical[i].trim().toUpperCase());
    }

    const { members, ...projectDataWithoutMembers } = params;

    params.technical = arrayTechnical;

    const project = await this.projectRepository.save({
      ...projectDataWithoutMembers,
      ...plainToClass(ProjectDto, projectDataWithoutMembers, {
        excludeExtraneousValues: true,
      }),
    });

    let employeeIds = [];

    if (params.members && params.members.length > 0) {
      for (let i = 0; i < params.members.length; i++) {
        const employee = await this.employeeRepository.findOne({
          where: {
            id: params.members[i].employeeId,
          },
        });

        if (!employee) {
          throw new NotFoundException(
            `Employee with ID ${params.members[i].employeeId} not exists`
          );
        }

        const newHistory = {
          employee: employee,
          project: project,
          position: params.members[i].position,
        };

        const createHistory = await this.historiesEntity.create(newHistory);

        this.historiesEntity.save(createHistory);
        employeeIds.push(employee.id);
      }
    }

    if (employeeIds.length > 0) {
      const employees = await this.employeeRepository.findBy({
        id: In(employeeIds),
      });
      await this.projectRepository.save({
        ...project,
        employees: employees,
      });
    }

    return new ResponseItem(project, "Create new data successfully");
  }

  async update(
    id: number,
    params: UpdateProjectDto
  ): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ["employees"],
    });

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    const arrayTechnical = params?.technical?.map((item) =>
      item.trim().toUpperCase()
    );

    const employees = await this.employeeRepository.findBy({
      id: In(params.employeeIds),
    });

    const result = await this.projectRepository.save({
      ...project,
      technical: arrayTechnical,
      ...plainToClass(UpdateProjectDto, params, {
        excludeExtraneousValues: true,
      }),
      employees,
    });

    return new ResponseItem(result, "Update data successfully");
  }

  async getProject(id: number): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository
      .createQueryBuilder("projects")
      .leftJoinAndSelect("projects.histories", "histories")
      .leftJoinAndSelect("histories.employee", "employee")
      .where("projects.id = :id", {
        id: id,
      })
      .getOne();

    if (!project) throw new BadRequestException("Project does not exist");

    return new ResponseItem(project, "Success");
  }

  async deleteProject(id: number): Promise<ResponseItem<null>> {
    const project = await this.projectRepository.findOneBy({
      id,
      deletedAt: null,
    });
    if (!project) throw new BadRequestException("Project does not exist");

    await this.projectRepository.softDelete(id);

    return new ResponseItem(null, "Delete Project successfully");
  }
}
