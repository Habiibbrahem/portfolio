// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { RefreshTokenService } from './refresh-token.service';
import { User } from '../users/schema/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private refreshTokenService: RefreshTokenService,
    ) { }

    async register(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create({ username, password: hashedPassword });
    }

    async login(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userId =
            user._id instanceof Types.ObjectId ? user._id.toString() : String(user._id);

        // ADD role TO PAYLOAD
        const payload = {
            username: user.username,
            sub: userId,
            role: user.role  // CRITICAL: this allows @Roles('admin') to work
        };

        const accessToken = this.jwtService.sign(payload);

        const refreshTokenOptions: JwtSignOptions = {
            secret:
                this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
                'default-refresh-secret',
            expiresIn: (this.configService.get('REFRESH_TOKEN_EXPIRES_IN') as any) || '7d',
        };

        const refreshToken = this.jwtService.sign(payload, refreshTokenOptions); // also include role in refresh token

        await this.refreshTokenService.create(userId, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret:
                    this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
                    'default-refresh-secret',
            }) as { username: string; sub: string; role: string };

            const storedToken = await this.refreshTokenService.findByToken(refreshToken);

            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            const user = await this.usersService.findByUsername(payload.username);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const userId =
                user._id instanceof Types.ObjectId ? user._id.toString() : String(user._id);

            const newPayload = {
                username: user.username,
                sub: userId,
                role: user.role  // include role in new access token
            };
            const newAccessToken = this.jwtService.sign(newPayload);

            return { access_token: newAccessToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}