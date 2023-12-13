import { CreateEmployeeDto } from "@app/modules/employee/dto/create-employee.dto";
import { EmployeeEntity } from "@app/modules/employee/entities";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Repository } from "typeorm";

@Injectable()
export class EmployeeSeeder implements Seeder {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async seed(): Promise<any> {
    await this.employeeRepository.query(`TRUNCATE employees RESTART IDENTITY CASCADE;`);


    const employees: CreateEmployeeDto[] = [
      {
        name: "employee01",
        phone: "001",
        date_of_birth: new Date("2000-12-25"),
        skills: [
            {
                exp: "10",
                name: "Skill A"
            },
            {
                exp: "10",
                name: "Skill B"
            }
        ],
        isManager: false,
        image: "aaaa",
      },
      {
        name: "employee02",
        phone: "0021244666",
        date_of_birth: new Date(2001-12-25),
        skills: [
            {
                name: "skill1",
                exp: "1"
            }
        ],
        isManager: false,
        image: "aaaa",
      },
      {
        name: "employee03",
        phone: "003",
        date_of_birth: new Date("2000-12-25"),
        skills: [
            {
                exp: "10",
                name: "Skill A"
            },
            {
                exp: "10",
                name: "Skill B"
            }
        ],
        isManager: true,
        image: "aaaa",
      },
      {
        name: "employee04",
        phone: "004",
        date_of_birth: new Date("2000-12-25"),
        skills: [
            {
                exp: "10",
                name: "Skill A"
            },
            {
                exp: "10",
                name: "Skill B"
            }
        ],
        isManager: true,
        image: "aaaa",
      },
    ];

    await this.employeeRepository.save(employees);
  }

  async drop(): Promise<any> {
    return this.employeeRepository.query(
      `TRUNCATE employees RESTART IDENTITY CASCADE;`
    );
  }
}
