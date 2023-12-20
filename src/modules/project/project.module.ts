import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeEntity } from "../employee/entities";
 
import { ProjectEntity } from "./entities";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { HistoriesEntity } from "../history/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      HistoriesEntity,
      EmployeeEntity,
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ConfigService],
  exports: [ProjectService],
})
export class ProjectsModule {}
