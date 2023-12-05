import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "../user/entities";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { EmployeeEntity } from "./entities";
import { SkillEntity } from "../skill/entities";
import { PositionEntity } from "../position/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, SkillEntity, PositionEntity]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, ConfigService],
  exports: [EmployeeService],
})
export class EmployeesModule {}
