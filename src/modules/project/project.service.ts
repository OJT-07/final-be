import { StatusProject } from "@Constant/enums";
import { ResponseItem } from "@app/common/dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";
import { EmployeeEntity } from "../employee/entities";
import { EmployeeProjectEntity } from "../employee_project/entities";
import { CreateProjectDto } from "./dto/create-project.dto";
import { GetProjectsDto } from "./dto/get-project.dto";
import { ProjectDto } from "./dto/project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectEntity } from "./entities";

@Injectable()
export class ProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(EmployeeProjectEntity)
    private readonly employeeProjectRepository: Repository<EmployeeProjectEntity>
  ) {}

  //GET PROJECTS LIST
  async getProjects(params: GetProjectsDto): Promise<ResponseItem<ProjectDto>> {
    const statusArray = params.status
      ? [params.status]
      : [StatusProject.ACTIVE, StatusProject.PENDING, StatusProject.DONE];

    const projects = await this.projectRepository.find();

    return new ResponseItem(projects, "Get data successfully");
  }

  //CREATE PROJECT
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
      // Use plainToClass with ProjectDto instead of CreateProjectDto
      ...plainToClass(ProjectDto, projectDataWithoutMembers, {
        excludeExtraneousValues: true,
      }),
    });

    if (params.members && params.members.length > 0) {
      const promises = params.members.map(async (member) => {
        const employee = await this.employeeRepository.find({
          where: {
            id: member.employeeId,
          },
        });

        if (employee === null) {
          console.log(`Employee with ID ${member.employeeId} not exists`);
        }

        const createEmployeeInProject =
          await this.employeeProjectRepository.create({
            employeeId: member.employeeId,
            projectId: Number(project.id),
            position: member.position,
          });

        this.employeeProjectRepository.save(createEmployeeInProject);
      });

      // Wait for all promises to resolve before moving on
      await Promise.all(promises);
    }

    return new ResponseItem(project, "Create new data successfully");
  }

  // UPDATE PROJECT
  async update(
    id: number,
    params: UpdateProjectDto
  ): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    let arrayTechnical = [];

    if (params.technical) {
      for (let i = 0; i < params.technical.length; i++) {
        arrayTechnical.push(params.technical[i].trim().toUpperCase());
      }
      params.technical = arrayTechnical;
    }

    // Perform the update
    await this.projectRepository.update(
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
    const updatedProject = await this.projectRepository.findOne({
      where: {
        id,
      },
    });

    if (!updatedProject) {
      throw new NotFoundException(`Error retrieving updated project`);
    }

    return new ResponseItem(updatedProject, "Update data successfully");
  }

  //GET PROJECT BY ID
  async getProject(id: number): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
    });

    const employeesInProject = await this.employeeProjectRepository.find({
      where: {
        projectId: id,
      },
    });

    if (!project) throw new BadRequestException("Project does not exist");

    return new ResponseItem({ ...project, employeesInProject }, "Success");
  }

  //DELETE PROJECT BY ID
  async deleteProject(id: number): Promise<ResponseItem<null>> {
    const user = await this.projectRepository.findOneBy({
      id,
      deletedAt: null,
    });
    if (!user) throw new BadRequestException("User does not exist");

    await this.projectRepository.softDelete(id);

    return new ResponseItem(null, "Delete Project successfully");
  }
}
