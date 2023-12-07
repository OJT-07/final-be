import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { seeder } from "nestjs-seeder";
import { DatabaseModule } from "./config/database.module";
import { ProjectSeeder } from "./database/seeders/project.seed";
import { UserSeeder } from "./database/seeders/user.seed";
import { EmployeeSeeder } from "./database/seeders/employee.seed";
import { EmployeeEntity } from "./modules/employee/entities";
import { UserEntity } from "./modules/user/entities/user.entity";
import { ProjectEntity } from "./modules/project/entities/project.entity";

seeder({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity, EmployeeEntity, ProjectEntity]), HttpModule],
  providers: [ConfigService],
}).run([UserSeeder, EmployeeSeeder, ProjectSeeder]);
