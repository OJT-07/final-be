import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { seeder } from "nestjs-seeder";
import { DatabaseModule } from "./config/database.module";
import { ProjectSeeder } from "./database/seeders/project.seed";
import { UserSeeder } from "./database/seeders/user.seed";
import { ProjectEntity } from "./modules/project/entities";
import { UserEntity } from "./modules/user/entities";

seeder({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, ProjectEntity]),
    HttpModule,
  ],
  providers: [ConfigService],
}).run([UserSeeder, ProjectSeeder]);
