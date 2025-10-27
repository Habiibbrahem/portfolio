import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    async saveFile(file: any) {
        return {
            originalName: file.originalname,
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        };
    }

    async deleteFile(filename: string) {
        const filePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { message: 'File deleted successfully' };
        } else {
            return { message: 'File not found' };
        }
    }
}
