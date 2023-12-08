import { StatusProject } from "@Constant/enums";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";
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
    private readonly projectRepository: Repository<ProjectEntity>
  ) {}

  //GET PROJECTS LIST
  async getProjects(
    params: GetProjectsDto
  ): Promise<ResponsePaginate<ProjectDto>> {
    const projects = this.projectRepository
      .createQueryBuilder("projects")
      .where("projects.status = ANY(:status)", {
        status: params.status
          ? [params.status]
          : [StatusProject.ACTIVE, StatusProject.PENDING, StatusProject.DONE],
      })
      .orderBy(`projects.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      projects.andWhere("LOWER(projects.name) LIKE LOWER(:name)", {
        name: `%${params.search}%`,
      });
    }

    const [result, total] = await projects.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, "Success");
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
    const project = await this.projectRepository.save({
      ...params,
      // Use plainToClass with ProjectDto instead of CreateProjectDto
      ...plainToClass(ProjectDto, params, {
        excludeExtraneousValues: true,
      }),
    });

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
      // relations: ["projects"],
    });
    if (!project) throw new BadRequestException("Project does not exist");

    return new ResponseItem({ ...project }, "Success");
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
