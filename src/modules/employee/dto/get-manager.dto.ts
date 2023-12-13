import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class GetManagersDto {
  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;
}
