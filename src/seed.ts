import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { seeder } from "nestjs-seeder";
import { DatabaseModule } from "./config/database.module";
import { UserEntity } from "./modules/user/entities";
import { UserSeeder } from "./database/seeders/user.seed";
import { SkillSeeder } from "./database/seeders/skill.seed";
import { SkillEntity } from "./modules/skill/entities";
import { EmployeeSeeder } from "./database/seeders/employee.seed";
import { EmployeeEntity } from "./modules/employee/entities";

seeder({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity, EmployeeEntity]), HttpModule],
  providers: [ConfigService],
}).run([UserSeeder, EmployeeSeeder]);
