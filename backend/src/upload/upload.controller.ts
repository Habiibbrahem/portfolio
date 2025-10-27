import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Delete,
    Param,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async uploadFile(@UploadedFile() file: any) {
        return this.uploadService.saveFile(file);
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':filename')
    async deleteFile(@Param('filename') filename: string) {
        return this.uploadService.deleteFile(filename);
    }
}
