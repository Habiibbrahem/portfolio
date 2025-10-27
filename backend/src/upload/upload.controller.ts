// src/upload/upload.controller.ts
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Delete,
    Param,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard) // Only admin can access (checked inside guard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const ext = path.extname(file.originalname);
                    const uniqueName = `${uuidv4()}${ext}`;
                    callback(null, uniqueName);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowedTypes = /jpeg|jpg|png|gif|webp/;
                const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
                if (isValid) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException('Only image files are allowed!'), false);
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return this.uploadService.saveFile(file);
    }

    @Delete(':filename')
    async deleteFile(@Param('filename') filename: string) {
        if (!filename) {
            throw new BadRequestException('Filename is required');
        }
        return this.uploadService.deleteFile(filename);
    }
}