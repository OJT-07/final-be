import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { seeder } from "nestjs-seeder";
import { DatabaseModule } from "./config/database.module";
import { UserEntity } from "./modules/user/entities";
import { UserSeeder } from "./database/seeders/user.seed";

seeder({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity]), HttpModule],
  providers: [ConfigService],
}).run([UserSeeder]);
