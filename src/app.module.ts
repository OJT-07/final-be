import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/config/database.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './modules/role/roles.module';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, RoleModule, UsersModule],
})
export class AppModule {}
