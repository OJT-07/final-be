import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { GetEmployeesDto } from "./dto/get-employees.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { EmployeeService } from "./employee.service";

import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { FileInterceptor } from "@nestjs/platform-express";

import * as fs from 'fs';
import { fileOption } from "@app/config/image-multer-config";

@Controller("employees")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', fileOption('uploads')))
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @UploadedFile() image: Express.Multer.File) {
    const result = await this.employeeService.create(createEmployeeDto, image);

    return result;
  }

  @Delete(":id")
  async deleteEmployee(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.employeeService.deleteUser(id)
  }

  @Get('managers')
  async getManagers(@Query() params: GetEmployeesDto): Promise<ResponsePaginate<EmployeeDto>> {
    return this.employeeService.getManagers(params);
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
  @UseInterceptors(FileInterceptor('image', fileOption('uploads'))) // You can choose to include this or not based on your requirements
  async updateEmployee(
    @Param('id') id: number,
    @Body() updateDto: UpdateEmployeeDto,
    @UploadedFile() image: Express.Multer.File
  ) {

    console.log("Entry update")

    // try {
    //   if (image) {
    //     const fileName = `${Date.now()}-${image.originalname.replace(/\s/g, '_')}`;
    //     const filePath = `uploads/${fileName}`;
    //     fs.promises.writeFile(filePath, image.buffer);
    //     updateDto.image = filePath;
    //   }

    //   const updatedEmployee = await this.employeeService.update(id, updateDto);
    //   return { success: true, data: updatedEmployee };
    // } catch (error) {
      //   return { success: false, error: 'Internal Server Error' };
      // }

      console.log(":==========", image)

       return  await this.employeeService.update(id, updateDto,image );
  }
}
