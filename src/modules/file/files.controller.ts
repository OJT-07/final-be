import * as fs from 'fs';
import { BadRequestException, Controller, Get, Param, Res } from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { FilesService } from './files.service';
import { convertPath } from '@app/common/utils/fileUtils';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/image/:filepath')
  findAvatar(@Param('filepath') filepath, @Res() res): Observable<object> {
    const path = convertPath(filepath, 'slash');
    if (fs.existsSync(path)) {
      return of(res.sendFile(join(process.cwd(), path)));
    }
    throw new BadRequestException('Hình ảnh không tồn tại');
  }
}