import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeProjectEntity } from "../employee_project/entities";
import { ProjectEntity } from "./entities";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, EmployeeProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectService, ConfigService],
  exports: [ProjectService],
})
export class ProjectsModule {}
