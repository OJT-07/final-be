import { hashPassword } from "@Constant/hash-password";
import { CreateUserDto } from "@app/modules/user/dto/create-user.dto";
import { UserEntity } from "@app/modules/user/entities";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Repository } from "typeorm";

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly configService: ConfigService
  ) {}

  async seed(): Promise<any> {
    await this.userRepository.query(`TRUNCATE users RESTART IDENTITY CASCADE;`);

    const password = await hashPassword(
      this.configService.get<string>("USER_PASSWORD")
    );

    const users: CreateUserDto[] = [
      {
        name: "user01",
        password: password,
        phone: "0944560561",
      },
      {
        name: "user02",
        password: password,
        phone: "0944560562",
      },
      {
        name: "user03",
        password: password,
        phone: "0944560563",
      },
      {
        name: "user04",
        password: password,
        phone: "0944560564",
      },
      {
        name: "user05",
        password: password,
        phone: "0944560565",
      },
    ];

    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    return this.userRepository.query(
      `TRUNCATE users RESTART IDENTITY CASCADE;`
    );
  }
}
