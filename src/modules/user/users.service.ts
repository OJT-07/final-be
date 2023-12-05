import { StatusEnum } from "@Constant/enums";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./entities";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(params: CreateUserDto): Promise<ResponseItem<UserDto>> {
    const userExisted = await this.userRepository.findOneBy({
      username: params.username,
      deletedAt: null,
    });
    if (userExisted) throw new BadRequestException("Username already exists");

    const existPhone = await this.userRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone)
      throw new BadRequestException("Phone number already exists");

    const userParams = this.userRepository.create({ ...params });

    const user = await this.userRepository.save({
      ...userParams,
      ...plainToClass(CreateUserDto, userParams, {
        excludeExtraneousValues: true,
      }),
    });

    return new ResponseItem(user, "Create new data successfully");
  }

  async deleteUser(id: number): Promise<ResponseItem<null>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) throw new BadRequestException("User does not exist");

    await this.userRepository.softDelete(id);

    return new ResponseItem(null, "Delete user successfully");
  }

  async getUsers(params: GetUsersDto): Promise<ResponsePaginate<UserDto>> {
    const users = this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.projects", "projects")
      .where("users.status = ANY(:status)", {
        status: params.status
          ? [params.status]
          : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .orderBy(`users.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      users.andWhere("LOWER(users.username) LIKE LOWER(:username)", {
        username: `%${params.search}%`,
      });
    }

    const [result, total] = await users.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, "Success");
  }

  async getUser(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ["projects"],
    });
    if (!user) throw new BadRequestException("User does not exist");

    return new ResponseItem({ ...user }, "Success");
  }
}
