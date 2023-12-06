import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeEntity } from "../employee/entities";
import { PositionEntity } from "./entities";
import { PositionController } from "./position.controller";
import { PositionService } from "./position.service";

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity, EmployeeEntity])],
  controllers: [PositionController],
  providers: [PositionService, ConfigService],
  exports: [PositionService],
})
export class PositionsModule {}
