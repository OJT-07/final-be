import { StatusEnum } from "@Constant/enums";
import { hashPassword } from "@Constant/hash-password";
import { PageMetaDto, ResponseItem, ResponsePaginate } from "@app/common/dtos";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { LoginUserDto } from "./dto/update-user.dto copy";
import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./entities";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

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

  async login(params: LoginUserDto): Promise<ResponseItem<UserDto>> {
    const userExisted = await this.userRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });

    if (!userExisted) {
      throw new BadRequestException("User name not exists");
    }

    const isPasswordCorrect = await comparePassword(
      params.password,
      userExisted.password
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException("Password is not correct!");
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      id: userExisted.id,
    });

    return new ResponseItem({ token }, "Login successful");
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
    });
    if (!user) throw new BadRequestException("User does not exist");
    return new ResponseItem({ ...user }, "Success");
  }

  async aboutMe(data): Promise<ResponseItem<UserDto>> {
    try {
      // Decode the token (without verifying the signature)
      const decodedToken = this.jwtService.decode(data.token);

      const user = await this.userRepository.findOne({
        where: {
          id: Number(decodedToken?.id),
        },
      });

      if (!user) {
        throw new BadRequestException("User does not exist");
      }

      return new ResponseItem({ ...user }, "Success");
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException("Invalid token");
      }

      // Handle other errors as needed
      throw error;
    }
  }
}
async function comparePassword(
  enteredPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, hashedPassword);
}
