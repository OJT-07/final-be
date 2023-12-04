import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from './config/database.module';
// import { UserSeeder } from './database/seeders/user.seed';

seeder({
  imports: [DatabaseModule, TypeOrmModule.forFeature([]), HttpModule],
  providers: [ConfigService],
}).run([]);
