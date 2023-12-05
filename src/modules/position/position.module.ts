import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeController } from "../employee/employee.controller";
import { EmployeeEntity } from "../employee/entities";
import { PositionEntity } from "./entities";
import { PositionService } from "./position.service";

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity, EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [PositionService, ConfigService],
  exports: [PositionService],
})
export class PositionsModule {}
