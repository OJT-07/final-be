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

@Controller("histories")
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

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
}
