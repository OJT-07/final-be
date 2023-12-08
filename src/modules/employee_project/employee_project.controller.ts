import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateEmployeeProjectDto } from "./dto/create-employee_project.dto";
import { EmployeeProjectService } from "./employee_project.service";
import { GetEmployeeProjectsDto } from "./dto/get-employee_project.dto";
import { EmployeeProjectDto } from "./dto/employee_project.dto";
import { ResponseItem, ResponsePaginate } from "@app/common/dtos";

@Controller("employeeProjects")
export class EmployeeProjectController {
  constructor(private readonly employeeProjectService: EmployeeProjectService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeProjectDto) {
    
   return await this.employeeProjectService.create(createEmployeeDto)
  }
  
  @Get()
  async getEmployeeProjects(
    @Query() getEmployeeProjectsDto: GetEmployeeProjectsDto): Promise<ResponsePaginate<EmployeeProjectDto>> {
      
    return await this.employeeProjectService.getEmployeeProjects(getEmployeeProjectsDto);
  }

  @Get(":id")
  async getEmployeeProject(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<EmployeeProjectDto>> {
    return await this.employeeProjectService.getEmployeeProject(id);
  }
}