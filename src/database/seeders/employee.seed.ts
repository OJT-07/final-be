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
        role: "role01",
        phone: "001",
        date_of_birth: "20/01/2001",
        avatar: "avatar01",
        skills: [
            {
                exp: 10,
                name: "Skill A"
            },
            {
                exp: 10,
                name: "Skill B"
            }
        ],
        position: "position01",
        department: "Department01",
        manager: "manager01"
      },
      {
        name: "employee02",
        role: "role02",
        phone: "002",
        date_of_birth: "20/12/2001",
        avatar: "avatar02",
        skills: [
            {
                name: "skill1",
                exp: 1
            }
        ],
        position: "position02",
        department: "Department02",
        manager: "manager02"
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
