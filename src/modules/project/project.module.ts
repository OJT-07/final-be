import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "../user/entities";
import { ProjectEntity } from "./entities";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity])],
  controllers: [ProjectController],
  providers: [ProjectService, ConfigService],
  exports: [ProjectService],
})
export class ProjectsModule {}
