import { StatusProject } from "@Constant/enums";
import { ProjectEntity } from "@app/modules/project/entities";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Repository } from "typeorm";

@Injectable()
export class ProjectSeeder implements Seeder {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    private readonly configService: ConfigService
  ) {}

  async seed(): Promise<any> {
    await this.projectRepository.query(
      `TRUNCATE projects RESTART IDENTITY CASCADE;`
    );

    const projects = [
      {
        name: "project01",
        description: "123",
        start_date: new Date("2000-12-25"),
        end_date: new Date("2000-12-25"),
        technical: ["2", "3", "4"],
        status: StatusProject.PENDING,
      },
      {
        name: "project02",
        description: "123",
        start_date: new Date("2000-12-25"),
        end_date: new Date("2000-12-25"),
        technical: ["2", "3", "4"],
        status: StatusProject.PENDING,
      },
      {
        name: "project03",
        description: "123",
        start_date: new Date("2000-12-25"),
        end_date: new Date("2000-12-25"),
        technical: ["2", "3", "4"],
        status: StatusProject.PENDING,
      },
      {
        name: "project04",
        description: "123",
        start_date: new Date("2000-12-25"),
        end_date: new Date("2000-12-25"),
        technical: ["2", "3", "4"],
        status: StatusProject.PENDING,
      },
      {
        name: "project05",
        description: "123",
        start_date: new Date("2000-12-25"),
        end_date: new Date("2023-12-25"),
        technical: ["2", "3", "4"],
        status: StatusProject.PENDING,
      },
    ];

    await this.projectRepository.save(projects);
  }

  async drop(): Promise<any> {
    return this.projectRepository.query(
      `TRUNCATE projects RESTART IDENTITY CASCADE;`
    );
  }
}
