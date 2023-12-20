import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "../employee/entities";
import { ProjectEntity } from "../project/entities";
import { HistoriesEntity } from "./entities";
import { HistoriesController } from "./history.controller";
import { HistoriesService } from "./history.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriesEntity, EmployeeEntity, ProjectEntity]),
  ],
  controllers: [HistoriesController],
  providers: [HistoriesService, ConfigService],
  exports: [HistoriesService],
})
export class HistoryModule {}
