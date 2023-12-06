import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntity } from "./entities";

@Injectable()
export class ProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) {}
}
