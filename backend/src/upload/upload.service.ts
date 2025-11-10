import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async saveFile(file: Express.Multer.File): Promise<{
        url: string;
        public_id: string;
        originalName: string;
    }> {
        if (!file?.buffer) {
            throw new BadRequestException('File buffer is missing');
        }

        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: 'portfolio',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' },
                        { width: 2000, crop: 'limit' },
                    ],
                },
                (error: any, result?: UploadApiResponse) => {
                    if (error) {
                        return reject(new BadRequestException(error.message || 'Cloudinary upload failed'));
                    }
                    if (!result) {
                        return reject(new BadRequestException('No response from Cloudinary'));
                    }

                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        originalName: file.originalname,
                    });
                },
            );

            upload.end(file.buffer);
        });
    }

    async deleteFile(publicId: string): Promise<{ message: string }> {
        if (!publicId) {
            throw new BadRequestException('public_id is required');
        }

        // Fix TS error: actual response has { result: 'ok' | 'not_found' }
        const result: any = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok' || result.result === 'not_found') {
            return { message: 'File deleted successfully' };
        }
        throw new BadRequestException('Failed to delete from Cloudinary');
    }
}