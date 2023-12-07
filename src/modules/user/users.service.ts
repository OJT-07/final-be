import { StatusEnum } from "@Constant/enums";
import { hashPassword } from "@Constant/hash-password";
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
      name: params.name,
      deletedAt: null,
    });
    if (userExisted) throw new BadRequestException("User name already exists");

    const existPhone = await this.userRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone)
      throw new BadRequestException("Phone number already exists");

    const newPassword = await hashPassword(params.password);

    const userParams = this.userRepository.create({
      ...params,
      password: newPassword,
    });

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
      .where("users.status = ANY(:status)", {
        status: params.status
          ? [params.status]
          : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .orderBy(`users.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      users.andWhere("LOWER(users.name) LIKE LOWER(:name)", {
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
<<<<<<< HEAD
=======
      // relations: ["projects"],
>>>>>>> 28f52c1e6d2845d3f206a4fff1911ff569db816b
    });
    if (!user) throw new BadRequestException("User does not exist");

    return new ResponseItem({ ...user }, "Success");
  }
}
