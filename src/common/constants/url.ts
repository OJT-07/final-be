import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const baseImageUrl = configService.get<string>('APP_URL') + '/api/files/avatar/';

export const avtPathName = (  fileName: string) => `uploads/${fileName}`;