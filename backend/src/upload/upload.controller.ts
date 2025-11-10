import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Delete,
    Param,
    UseGuards,
    BadRequestException,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { v2 as cloudinary } from 'cloudinary';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, callback) => {
                const allowed = /jpeg|jpg|png|gif|webp/;
                const ext = file.originalname.toLowerCase().match(/\.[^.]+$/);
                const isValid = ext && allowed.test(ext[0]) && allowed.test(file.mimetype);
                callback(isValid ? null : new BadRequestException('Only images allowed'), !!isValid);
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file uploaded');

        const result = await this.uploadService.saveFile(file);
        return {
            url: result.url,
            public_id: result.public_id,
            originalName: result.originalName,
        };
    }

    // FINAL FIX: *publicId returns string | string[] → always convert to string
    @Delete('*publicId')
    async deleteFile(@Param('publicId') publicId: string | string[]) {
        let cleanId: string;

        if (Array.isArray(publicId)) {
            cleanId = publicId.join('/'); // handles portfolio/abc123 → "portfolio/abc123"
        } else if (typeof publicId === 'string') {
            cleanId = publicId.startsWith('/') ? publicId.slice(1) : publicId;
        } else {
            throw new BadRequestException('Invalid public_id');
        }

        if (!cleanId) throw new BadRequestException('public_id is required');

        return this.uploadService.deleteFile(cleanId);
    }

    @Get()
    async getAllImages() {
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'portfolio/',
            max_results: 500,
        });

        return resources.map((img: any) => ({
            url: img.secure_url,
            public_id: img.public_id,
            originalName: img.original_filename ? `${img.original_filename}.${img.format}` : img.public_id.split('/').pop(),
            uploadedAt: img.created_at,
            width: img.width,
            height: img.height,
        }));
    }
}