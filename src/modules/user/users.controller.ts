import { ResponseItem, ResponsePaginate } from "@app/common/dtos";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Delete(":id")
  async deleteUser(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<null>> {
    return await this.usersService.deleteUser(id);
  }

  @Get()
  async getUsers(
    @Query() getUsersDto: GetUsersDto
  ): Promise<ResponsePaginate<UserDto>> {
    return await this.usersService.getUsers(getUsersDto);
  }

  @Get(":id")
  async getUser(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.getUser(id);
  }

  @Post("login")
  async login(@Body() loginUserDto) {
    return await this.usersService.login(loginUserDto);
  }
}
