import { Module } from "@nestjs/common";

import { DatabaseModule } from "@app/config/database.module";
import { ConfigModule } from "@nestjs/config";

import { ProjectsModule } from "./modules/project/project.module";
import { UsersModule } from "./modules/user/users.module";
import { EmployeesModule } from "./modules/employee/employee.module";
import { PositionsModule } from "./modules/position/position.module";
import { SkillsModule } from "./modules/skill/skill.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    EmployeesModule,
    PositionsModule,
    SkillsModule,
  ],
})
export class AppModule {}
