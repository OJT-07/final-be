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
import { EmployeeProjectService } from "./employee_project.service";

@Controller("employeeProjects")
export class EmployeeProjectController {
  constructor(
    private readonly employeeProjectService: EmployeeProjectService
  ) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeProjectDto) {
    console.log("controller",createEmployeeDto);
    return await this.employeeProjectService.create(createEmployeeDto);
  }

  @Get()
  async getEmployeeProjects(
    @Query() getEmployeeProjectsDto: GetEmployeeProjectsDto
  ): Promise<ResponsePaginate<EmployeeProjectDto>> {
    return await this.employeeProjectService.getEmployeeProjects(
      getEmployeeProjectsDto
    );
  }

  @Get(":id")
  async getEmployeeProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    return await this.employeeProjectService.getEmployeeProject(id);
  }

  //DELETE PROJECT CONTROLLER
  @Delete(":id")
  async deleteProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.employeeProjectService.deleteEmployeeProject(id);
  }

  //UPDATE PROJECT CONTROLLER
  @Put(":id")
  async updateProject(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmployeeProjectDto: UpdateEmployeeProjectDto
  ) {
    return await this.employeeProjectService.update(
      id,
      updateEmployeeProjectDto
    );
  }
}
