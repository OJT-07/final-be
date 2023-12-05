import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SkillEntity } from "./entities";
import { SkillController } from "./skill.controller";
import { SkillService } from "./skill.service";
import { EmployeeEntity } from "../employee/entities";

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, EmployeeEntity])],
  controllers: [SkillController],
  providers: [SkillService, ConfigService],
  exports: [SkillService],
})
export class SkillsModule {}
