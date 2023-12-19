import { ResponseItem } from "@app/common/dtos";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectDto } from "./dto/project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  //GET PROJECT CONTROLLER
  @Get()
  async getProjects(): Promise<ResponseItem<ProjectDto>> {
    return await this.projectService.getProjects();
  }

  //POST PROJECT CONTROLLER
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  //UPDATE PROJECT CONTROLLER
  @Patch(":id")
  async updateProject(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return await this.projectService.assignEmployee(id, updateProjectDto);
  }

  //GET PROJECT BY ID CONTROLLER
  @Get(":id")
  async getProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<ProjectDto>> {
    return await this.projectService.getProject(id);
  }

  //DELETE PROJECT CONTROLLER
  @Delete(":id")
  async deleteProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.projectService.deleteProject(id);
  }
}
