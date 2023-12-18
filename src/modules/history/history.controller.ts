import { ResponseItem, ResponsePaginate } from "@app/common/dtos";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateEmployeeProjectDto } from "./dto/create-employee_project.dto";
import { EmployeeProjectDto } from "./dto/employee_project.dto";
import { GetEmployeeProjectsDto } from "./dto/get-employee_project.dto";
import { UpdateEmployeeProjectDto } from "./dto/update-employee_project.dto";
import { HistoriesService } from "./history.service";

@Controller("employeeProjects")
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeProjectDto) {
    return await this.historiesService.create(createEmployeeDto);
  }

  @Get()
  async getEmployeeProjects(
    @Query() getEmployeeProjectsDto: GetEmployeeProjectsDto
  ): Promise<ResponsePaginate<EmployeeProjectDto>> {
    return await this.historiesService.getEmployeeProjects(
      getEmployeeProjectsDto
    );
  }

  @Get(":id")
  async getEmployeeProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    return await this.historiesService.getEmployeeProject(id);
  }

  //DELETE PROJECT CONTROLLER
  @Delete(":id")
  async deleteProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.historiesService.deleteEmployeeProject(id);
  }

  //UPDATE PROJECT CONTROLLER
  @Put(":id")
  async updateProject(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmployeeProjectDto: UpdateEmployeeProjectDto
  ) {
    return await this.historiesService.update(id, updateEmployeeProjectDto);
  }
}
