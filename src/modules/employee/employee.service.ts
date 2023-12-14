import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { EmployeeEntity } from "./entities";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { EmployeeDto } from "./dto/employee.dto";
import { plainToClass } from "class-transformer";
import { GetEmployeesDto } from "./dto/get-employees.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { GetManagersDto } from "./dto/get-manager.dto";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>
  ) { }

  //CREATE 
  async create(params: CreateEmployeeDto): Promise<ResponseItem<EmployeeDto>> {
    const emailExisted = await this.employeeRepository.findOneBy({
      email: params.email,
      deletedAt: null,
    });
    if (emailExisted) throw new BadRequestException("Email already exists");

    const existPhone = await this.employeeRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone)
      throw new BadRequestException("Phone number already exists");

    const employee = await this.employeeRepository.save(params)

    return new ResponseItem(plainToClass(EmployeeDto, employee), "Create new data successfully");
  }

  //DELETE
  async deleteUser(id: number): Promise<ResponseItem<null>> {
    const employee = await this.employeeRepository.findOneBy({ id, deletedAt: null });
    if (!employee) throw new BadRequestException("Employee does not exist");

    await this.employeeRepository.softDelete(id);

    return new ResponseItem(null, "Delete employee successfully");
  }

  async getEmployees(params: GetEmployeesDto): Promise<ResponsePaginate<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> = this.employeeRepository.createQueryBuilder("employees");
    queryBuilder
      .orderBy(`employees.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.name) {
      queryBuilder.andWhere("LOWER(employees.name) LIKE LOWER(:name)", {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const employeesDto = result.map((employee) => plainToClass(EmployeeDto, employee));

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeesDto, pageMetaDto, "Success");
  }

  async getEmployee(id: number): Promise<ResponseItem<EmployeeDto>> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
      },
    });
    if (!employee) throw new BadRequestException("Employee does not exist");

    const employeeDto = plainToClass(EmployeeDto, employee);

    return new ResponseItem(employeeDto, "Success");
  }

  // Get Manager

  async getManagers(params: GetEmployeesDto): Promise<ResponsePaginate<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> = this.employeeRepository.createQueryBuilder("employees").where("employees.isManager = :isManager", { isManager: true }) // Chỉ lấy những người quản lý
      .orderBy(`employees.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);


    if (params.name) {
      queryBuilder.andWhere("LOWER(employees.name) LIKE LOWER(:name)", {
        name: `%${params.name}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    // Thêm logic để load thông tin quản lý
    const employeesDto = result.map((employee) => {
      return plainToClass(EmployeeDto, employee);
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(employeesDto, pageMetaDto, "Success");
  }



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
