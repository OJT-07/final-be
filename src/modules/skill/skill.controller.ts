import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SkillService } from "./skill.service";
import { ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { GetSkillsDto } from "./dto/get-skill.dto";
import { SkillDto } from "./dto/skill.dto";
import { CreateSkillDto } from "./dto/create-skill.dto";

@Controller("skills")
export class SkillController {
  constructor(private readonly skillService: SkillService) {}
  
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto) {
    return await this.skillService.create(createSkillDto);
  }

  @Delete(":id")
  async deleteSkill(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.skillService.deleteSkill(id);
  }

  @Get()
  async getSkills(
    @Query() getSkillsDto: GetSkillsDto
  ): Promise<ResponsePaginate<SkillDto>> {
    return await this.skillService.getSkills(getSkillsDto);
  }

  @Get(":id")
  async getSkill(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<SkillDto>> {
    return await this.skillService.getSkill(id);
  }
}
