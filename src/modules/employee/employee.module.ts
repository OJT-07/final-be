import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { EmployeeEntity } from "./entities";
import { HistoriesEntity } from "../history/entities";
@Module({
  imports: [TypeOrmModule.forFeature([HistoriesEntity, EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService, ConfigService],
  exports: [EmployeeService],
})
export class EmployeesModule {}
