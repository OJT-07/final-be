import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SkillEntity } from "./entities";

@Injectable()
export class SkillService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>
  ) {}
}
