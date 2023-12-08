import { hashPassword } from "@Constant/hash-password";
import { CreateSkillDto } from "@app/modules/skill/dto/create-skill.dto";
import { SkillEntity } from "@app/modules/skill/entities";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Repository } from "typeorm";

@Injectable()
export class SkillSeeder implements Seeder {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async seed(): Promise<any> {
    await this.skillRepository.query(`TRUNCATE skills RESTART IDENTITY CASCADE;`);


    const skills: CreateSkillDto[] = [
      {
        name: "skill01",
        description: "skill01abc",
      },
      {
        name: "skill02",
        description: "skill02abc",
      },
      {
        name: "skill03",
        description: "skill03abc",
      },
      {
        name: "skill04",
        description: "skill04abc",
      },
      {
        name: "skill05",
        description: "skill05abc",
      },
    ];

    await this.skillRepository.save(skills);
  }

  async drop(): Promise<any> {
    return this.skillRepository.query(
      `TRUNCATE skills RESTART IDENTITY CASCADE;`
    );
  }
}
