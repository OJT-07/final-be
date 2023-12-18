import { Module } from "@nestjs/common";

import { DatabaseModule } from "@app/config/database.module";
import { ConfigModule } from "@nestjs/config";

import { ProjectsModule } from "./modules/project/project.module";
import { UsersModule } from "./modules/user/users.module";
import { EmployeesModule } from "./modules/employee/employee.module";
import { EmployeeProjectModule } from "./modules/employee_project/employee_project.module";
import { FilesModule } from "./modules/file/file.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    EmployeesModule,
    EmployeeProjectModule,
    FilesModule
  ],
})
export class AppModule {}
