import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeProjectEntity } from "./entities";
import { ConfigService } from "@nestjs/config/dist";
import { EmployeeProjectController } from "./employee_project.controller";
import { EmployeeProjectService } from "./employee_project.service";
import { EmployeeEntity } from "../employee/entities";
import { ProjectEntity } from "../project/entities";
@Module({
    imports: [
      TypeOrmModule.forFeature([EmployeeProjectEntity, EmployeeEntity, ProjectEntity]),
    ],
    controllers: [EmployeeProjectController],
    providers: [EmployeeProjectService, ConfigService],
    exports: [EmployeeProjectService],
  })
  export class EmployeeProjectModule {}