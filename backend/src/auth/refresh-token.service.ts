// src/auth/refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from './schema/refresh-token.schema';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(RefreshToken.name)
        private refreshTokenModel: Model<RefreshTokenDocument>,
    ) { }

    async create(userId: string, token: string): Promise<RefreshTokenDocument> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const refreshToken = new this.refreshTokenModel({
            userId,
            token,
            expiresAt,
        });

        return refreshToken.save();
    }

    async findByToken(token: string): Promise<RefreshTokenDocument | null> {
        return this.refreshTokenModel.findOne({ token }).exec();
    }
}