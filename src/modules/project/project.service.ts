import { currentTime } from "@Constant/nowDate";
import { ResponseItem } from "@app/common/dtos";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { In, Repository } from "typeorm";
import { EmployeeEntity } from "../employee/entities";
import { HistoriesEntity } from "../history/entities";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectDto } from "./dto/project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectEntity } from "./entities";

@Injectable()
export class ProjectService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    @InjectRepository(HistoriesEntity)
    private readonly historiesEntity: Repository<HistoriesEntity>
  ) {}

  async getProjects(): Promise<ResponseItem<ProjectDto>> {
    const projects = await this.projectRepository.find();

    return new ResponseItem(projects, "Get data successfully");
  }

  async create(params: CreateProjectDto): Promise<ResponseItem<ProjectDto>> {
    const projectExist = await this.projectRepository.findOne({
      where: {
        name: params.name,
      },
    });

    if (projectExist) {
      throw new NotFoundException(`Project name already exist`);
    }

    let arrayTechnical = [];
    for (let i = 0; i < params.technical.length; i++) {
      arrayTechnical.push(params.technical[i].trim().toUpperCase());
    }

    const { members, ...projectDataWithoutMembers } = params;

    params.technical = arrayTechnical;

    const project = await this.projectRepository.save({
      ...projectDataWithoutMembers,
      ...plainToClass(ProjectDto, projectDataWithoutMembers, {
        excludeExtraneousValues: true,
      }),
    });

    if (params.members && params.members.length > 0) {
      for (let i = 0; i < params.members.length; i++) {
        const employee = await this.employeeRepository.findOne({
          where: {
            id: params.members[i].employeeId,
          },
        });

        if (!employee) {
          throw new NotFoundException(
            `Employee with ID ${params.members[i].employeeId} not exists`
          );
        }

        const newHistory = {
          employee: employee,
          project: project,
          position: params.members[i].position,
        };

        const createHistory = await this.historiesEntity.create(newHistory);

        await this.historiesEntity.save(createHistory);

        await this.projectRepository.save({
          ...project,
          employees: [employee],
        });
      }
    }

    return new ResponseItem(project, "Create new data successfully");
  }

  async assignEmployee(
    id: number,
    params: UpdateProjectDto
  ): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository.findOne({
      where: { id, deletedAt: null },
      relations: ["employees", "histories"],
    });
    if (!project) throw new BadRequestException("Project not found");

    const employeeIds = params.members?.map((item) => item.employeeId);
    const employees = await this.employeeRepository.findBy({
      id: In(employeeIds),
    });

    let originalEmployee = project?.employees.map(({ id }) => id);
    const updatedEmployee = employees.map(({ id }) => id);

    type diffDetail = {
      added: number[];
      subtracted: number[];
    };

    const differenceItem: number[] = updatedEmployee
      .filter((x) => !originalEmployee.includes(x))
      .concat(originalEmployee.filter((x) => !updatedEmployee.includes(x)));

    let diffDetail: diffDetail = {
      added: [],
      subtracted: [],
    };

    differenceItem.forEach((id) => {
      if (updatedEmployee.includes(id)) {
        return (diffDetail = {
          ...diffDetail,
          added: [...diffDetail.added, id],
        });
      }
      return (diffDetail = {
        ...diffDetail,
        subtracted: [...diffDetail.subtracted, id],
      });
    });

    if (diffDetail?.subtracted.length > 0) {
      const subtractedArr = project?.employees.reduce<number[]>(
        (pre, current) => {
          if (!diffDetail.subtracted.includes(current.id)) {
            return [...pre, current.id];
          }
          return pre;
        },
        []
      );
      originalEmployee = subtractedArr;
    }

    if (diffDetail?.added.length > 0) {
      originalEmployee = originalEmployee.concat(
        diffDetail?.added.filter((item) => originalEmployee.indexOf(item) < 0)
      );
    }

    const arrayTechnical = params?.technical?.map((item) =>
      item.trim().toUpperCase()
    );

    const assignEmployees = await this.employeeRepository.findBy({
      id: In(originalEmployee),
    });

    const result = await this.projectRepository.save({
      ...project,
      technical: arrayTechnical,
      employees: assignEmployees,
      status: params.status,
      name: params.name,
      start_date: params.start_date,
      end_date: params.end_date,
      description: params.description,
    });

    if (diffDetail?.subtracted.length > 0) {
      const promises = diffDetail.subtracted.map(async (employeeId) => {
        const history = await this.historiesEntity
          .createQueryBuilder("histories")
          .leftJoinAndSelect("histories.employee", "employee")
          .where("employee.id = :id", { id: employeeId })
          .getOne();

        await this.historiesEntity.save({
          ...history,
          ...plainToClass(UpdateProjectDto, params, {
            excludeExtraneousValues: true,
          }),
          end_date: currentTime(),
        });
      });

      await Promise.all(promises);
    }

    if (diffDetail?.added.length > 0) {
      diffDetail?.added.forEach(async (addedEmployeeId) => {
        const employee = await this.employeeRepository
          .createQueryBuilder("employees")
          .where("employees.id = :id", { id: addedEmployeeId })
          .getOne();

        const positions = params.members?.find(
          ({ employeeId }) => Number(employeeId) === Number(addedEmployeeId)
        );

        const createHistory = await this.historiesEntity.create({
          employee,
          project: result,
          position: positions.position,
        });

        await this.historiesEntity.save(createHistory);
      });
    }

    return new ResponseItem(result, "Update success");
  }

  async getProject(id: number): Promise<ResponseItem<ProjectDto>> {
    const project = await this.projectRepository
      .createQueryBuilder("projects")
      .leftJoinAndSelect("projects.histories", "histories")
      .leftJoinAndSelect("histories.employee", "employee")
      .where("projects.id = :id", { id: id })
      .getOne();

    if (!project) throw new BadRequestException("Project does not exist");

    return new ResponseItem({ ...project }, "Success");
  }

  async deleteProject(id: number): Promise<ResponseItem<null>> {
    const project = await this.projectRepository.findOneBy({
      id,
      deletedAt: null,
    });
    if (!project) throw new BadRequestException("Project does not exist");

    if (project.status === "active") {
      throw new BadRequestException("Project in progress");
    }
    await this.projectRepository.softDelete(id);

    return new ResponseItem(null, "Delete Project successfully");
  }
}
