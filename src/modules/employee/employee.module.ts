import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeProjectEntity } from "../employee_project/entities";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { EmployeeEntity } from "./entities";
@Module({
  imports: [TypeOrmModule.forFeature([EmployeeProjectEntity, EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService, ConfigService],
  exports: [EmployeeService],
})
export class EmployeesModule {}
