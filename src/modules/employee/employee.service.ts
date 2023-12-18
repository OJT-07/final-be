import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository, SelectQueryBuilder } from "typeorm";
import { EmployeeProjectEntity } from "../employee_project/entities";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { GetEmployeesDto } from "./dto/get-employees.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeEntity } from "./entities";
import { avtPathName } from "@Constant/url";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(EmployeeProjectEntity)
    private readonly employeeProjectRepository: Repository<EmployeeProjectEntity>
  ) {}

  async create(params: CreateEmployeeDto,  file: Express.Multer.File): Promise<ResponseItem<EmployeeDto>> {
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

      const newData = {...params, image: file? avtPathName(file.originalname) : ''};

    const employee = await this.employeeRepository.save(newData);

    return new ResponseItem(
      plainToClass(EmployeeDto, employee),
      "Create new data successfully"
    );
  }

  async deleteUser(id: number): Promise<ResponseItem<null>> {
    const employee = await this.employeeRepository.findOneBy({
      id,
      deletedAt: null,
    });
    if (!employee) throw new BadRequestException("Employee does not exist");

    await this.employeeRepository.softDelete(id);

    return new ResponseItem(null, "Delete employee successfully");
  }

  async getEmployees(
    params: GetEmployeesDto
  ): Promise<ResponsePaginate<EmployeeDto>> {
    const queryBuilder: SelectQueryBuilder<EmployeeEntity> =
      this.employeeRepository.createQueryBuilder("employees");
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
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
      },
    });
    if (!employee) throw new BadRequestException("Employee does not exist");

    const projectsEmployeeJoined = await this.employeeProjectRepository.find({
      where: {
        employeeId: id,
      },
    });

    return new ResponseItem({ ...employee, projectsEmployeeJoined }, "Success");

    // const employeeDto = plainToClass(EmployeeDto, employee);
    //return new ResponseItem(employeeDto, "Success");
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

  //UPDATE
  async update(
    id: number,
    params: UpdateEmployeeDto,
    file: Express.Multer.File
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
        image: file? avtPathName(  file.originalname) : '',
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
