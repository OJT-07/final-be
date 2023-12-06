import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PositionEntity } from "./entities";

@Injectable()
export class PositionService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(PositionEntity)
    private readonly employeeRepository: Repository<PositionEntity>
  ) {}
}
