import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository, SelectQueryBuilder } from "typeorm";

import { HistoriesEntity } from "../history/entities";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { GetEmployeesDto } from "./dto/get-employees.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeEntity } from "./entities";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(HistoriesEntity)
    private readonly historiesRepository: Repository<HistoriesEntity>
  ) {}

  //CREATE
  async create(params: CreateEmployeeDto): Promise<ResponseItem<EmployeeDto>> {
    const employeeExisted = await this.employeeRepository.findOneBy({
      name: params.name,
      deletedAt: null,
    });
    if (employeeExisted)
      throw new BadRequestException("Employee name already exists");

    const existPhone = await this.employeeRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone)
      throw new BadRequestException("Phone number already exists");

    const employee = await this.employeeRepository.save(params);

    return new ResponseItem(
      plainToClass(EmployeeDto, employee),
      "Create new data successfully"
    );
  }

  //DELETE EMPLOYEE
  async deleteUser(id: number): Promise<ResponseItem<null>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> =
      this.employeeRepository.createQueryBuilder("employees");

    queryBuilder
      .leftJoinAndSelect("employees.histories", "histories")
      .leftJoinAndSelect("histories.project", "project")
      .andWhere("employees.id = :id", { id: id })
      .andWhere("employees.deletedAt IS NULL")
      .andWhere("project.status = :status", { status: "active" });

    const [result, total] = await queryBuilder.getManyAndCount();

    if (!result || result.length === 0) {
      await this.employeeRepository.softDelete(id);
      return new ResponseItem(null, "Delete employee successfully");
    }

    throw new BadRequestException("Can not remove this employee.");
  }

  //GET ALL EMPLOYEE
  async getEmployees(
    params: GetEmployeesDto
  ): Promise<ResponsePaginate<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> =
      this.employeeRepository.createQueryBuilder("employees");

    queryBuilder
      .leftJoinAndSelect("employees.histories", "histories")
      .leftJoinAndSelect("histories.project", "project")
      .orderBy(`employees.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.name) {
      queryBuilder.andWhere("LOWER(employees.name) LIKE LOWER(:name)", {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const employeesDto = result.map((employee) =>
      plainToClass(EmployeeDto, employee)
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeesDto, pageMetaDto, "Success");
  }

  //GET BY ID
  async getEmployee(id: number): Promise<ResponseItem<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> =
      this.employeeRepository.createQueryBuilder("employees");

    queryBuilder
      .leftJoinAndSelect("employees.histories", "histories")
      .leftJoinAndSelect("histories.project", "project")
      .andWhere("employees.id = :id", { id: id })
      .andWhere("employees.deletedAt IS NULL");

    const [result, total] = await queryBuilder.getManyAndCount();

    if (!result || result.length === 0) {
      throw new BadRequestException("No matching records found.");
    }

    return new ResponseItem(result, "Success");
  }

  // Get Manager
  async getManagers(
    params: GetEmployeesDto
  ): Promise<ResponsePaginate<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> =
      this.employeeRepository
        .createQueryBuilder("employees")
        .where("employees.isManager = :isManager", { isManager: true }) // Chỉ lấy những người quản lý
        .orderBy(`employees.${params.orderBy}`, params.order)
        .skip(params.skip)
        .take(params.take);

    if (params.name) {
      queryBuilder.andWhere("LOWER(employees.name) LIKE LOWER(:name)", {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const employeesDto = result.map((employee) => {
      return plainToClass(EmployeeDto, employee);
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeesDto, pageMetaDto, "Success");
  }

  //UPDATE
  async update(
    id: number,
    params: UpdateEmployeeDto
  ): Promise<ResponseItem<EmployeeDto>> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
      },
    });

    if (!employee) throw new NotFoundException("Employee not found");

    await this.employeeRepository.update(
      {
        id: employee.id,
      },
      {
        ...params,
        ...plainToClass(EmployeeEntity, params, {
          excludeExtraneousValues: true,
        }),
      }
    );

    const updatedEmployee = await this.employeeRepository.findOne({
      where: {
        id,
      },
    });

    if (!updatedEmployee) {
      throw new NotFoundException(`Error retrieving updated employee`);
    }

    return new ResponseItem(updatedEmployee, "Update data successfully");
  }
}
