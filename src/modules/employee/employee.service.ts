import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeEntity } from "./entities";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>
  ) {}
}
