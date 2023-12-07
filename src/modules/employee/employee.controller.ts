import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { GetEmployeesDto } from "./dto/get-employees.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";

import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Controller("employees")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.create(createEmployeeDto)
  }

  @Delete(":id")
  async deleteEmployee(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.employeeService.deleteUser(id)
  }

  @Get()
  async getEmployees(
    @Query() getEmployeesDto: GetEmployeesDto): Promise<ResponsePaginate<EmployeeDto>> {
      
    return await this.employeeService.getEmployees(getEmployeesDto);
  }

  @Get(":id")
  async getEmployee(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<EmployeeDto>> {
    return await this.employeeService.getEmployee(id);
  }

  @Patch(':id')
  async updateEmployee(@Param('id') id: number, @Body() updateDto: UpdateEmployeeDto) {
    try {
      const updatedEmployee = await this.employeeService.update(id, updateDto);
      return { success: true, data: updatedEmployee };
    } catch (error) {
      return { success: false, error: 'Internal Server Error' };
    }
  }
}
